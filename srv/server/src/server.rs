use crate::Args;
use pikud;
use serde_json;
use log::{debug, error};
use tokio::{time::Duration, sync::{mpsc::{self, UnboundedSender}, Mutex, RwLock}};
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::{Filter, ws::{Message, WebSocket}};
use futures_util::{SinkExt, StreamExt, TryFutureExt, stream::{SplitSink, SplitStream}};
use std::{collections::HashMap,net::Ipv4Addr,sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
}};

/// Our global unique user id counter.
static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

/// Our state of currently connected users.
///
/// - Key is their id
/// - Value is a sender of `warp::ws::Message`
type Users = Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Message>>>>;

pub async fn start(args: Args) {

    let default_cert_bytes = include_bytes!("../assets/default_cert.pem");
    let default_key_bytes = include_bytes!("../assets/default_key.rsa");

    // Keep track of all connected users, key is usize, value
    // is a websocket sender.
    let users = Users::default();

    let client: Arc<Mutex<pikud::Client>>;
    if args.mock {
        client = Arc::new(Mutex::new(pikud::Client::new_mock()));
    } else {
        client = Arc::new(Mutex::new(pikud::Client::new()));
    }
    
    

    tokio::spawn(
        alert_notify_task(users.clone(), client.clone(), args.interval.into())
    );
    tokio::spawn(
        send_ping_task(users.clone(), args.ping_interval.into())
    );

    let users = warp::any().map(move || users.clone());

    let app = warp::path("ws")
        // The `ws()` filter will prepare Websocket handshake...
        .and(warp::ws())
        .and(users)
        .map(move |ws: warp::ws::Ws, users| {
            // This will call our function if the handshake succeeds.
            let client = client.clone();
            ws.on_upgrade(move |socket| user_connected(socket, users, client))
        });


    let addr = args.address.parse::<Ipv4Addr>().expect(format!("Cant parse address: {}", args.address).as_str());
    if args.secure {
        // custom key and cert
        if let (Some(cert_path), Some(key_path)) = (args.cert_path, args.key_path) {
            warp::serve(app)
            .tls()
            .cert_path(cert_path)
            .key_path(key_path)
            .run((addr, args.port)).await;
        }
        else {
            // serve with default cert and key
            warp::serve(app)
            .tls()
            .cert(default_cert_bytes)
            .key(default_key_bytes)
            .run((addr, args.port)).await;
        }
    } else {
        // serve as insecure server
        warp::serve(app)
        .run((addr, args.port)).await;
    }
    
}

async fn sender_task(mut rx: UnboundedReceiverStream<Message>, mut tx: SplitSink<WebSocket, Message>) {
    while let Some(message) = rx.next().await {
        tx
            .send(message)
            .unwrap_or_else(|e| {
                debug!("websocket send error: {}", e);
            })
            .await;
    }
}

async fn receiver_task(
    my_id: usize,
    mut user_ws_rx: SplitStream<WebSocket>,
    tx: UnboundedSender<Message>,
    client: Arc<Mutex<pikud::Client>>,
) {
    while let Some(result) = user_ws_rx.next().await {
        match result {
            Ok(msg) => {
                let msg_json = msg.to_str().unwrap_or("{}");
                if let Ok(msg_data) = serde_json::from_str::<serde_json::Value>(msg_json) {
                    let maybe_action = msg_data.get("action").and_then(|a| a.as_str());
                    if let Some(action) = maybe_action {
                        match action {
                            "test" => {
                                let result = tx.send(Message::text(client.lock().await.get_mock_alert().to_string()));
                                match result {
                                    Err(e) => {
                                        error!("Error sending back test {}", e);
                                    },
                                    _ => {}
                                }
                            },
                            _ => {}
                        }
                    }
                }
            },
            Err(e) => {
                debug!("websocket error(uid={}): {}", my_id, e);
                break;
            }
        };
    }
}

async fn user_connected(ws: WebSocket, users: Users, client: Arc<Mutex<pikud::Client>>) {
    // Use a counter to assign a new unique ID for this user.
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    // Split the socket into a sender and receive of messages.
    let (user_ws_tx, user_ws_rx) = ws.split();
    
    // Use an unbounded channel to handle buffering and flushing of messages
    // to the websocket...
    let (tx, rx) = mpsc::unbounded_channel();
    let rx = UnboundedReceiverStream::new(rx);

    tokio::task::spawn(sender_task(rx, user_ws_tx));


    // Save the sender in our list of connected users.
    users.write().await.insert(my_id, tx.clone());

    receiver_task(my_id, user_ws_rx, tx, client).await;
    // disconnect when receiver stopping
    user_disconnected(my_id, &users).await;
}

async fn user_disconnected(my_id: usize, users: &Users) {
    // Stream closed up, so remove from the user list
    users.write().await.remove(&my_id);
}

async fn send_ping_task(users: Users, interval: Duration) {
    loop {
        for (&_uid, tx) in users.read().await.iter() {
            if let Err(_disconnected) = tx.send(Message::ping("")) {
                // The tx is disconnected, our `user_disconnected` code
                // should be happening in another task, nothing more to do here.
            }
        }
        // Continue after waiting
        tokio::time::sleep(interval).await;
    }
}

async fn alert_notify_task(
    users: Users,
    client: Arc<Mutex<pikud::Client>>,
    interval: Duration
) -> Result<(), Box<dyn std::error::Error + Send>> {
    loop {
        match client.lock().await.get_alert().await {
            Ok(maybe_alert) => {
                if let Some(alert) = maybe_alert {
                    let current_users = users.read().await;
                    debug!("sending alert to {} clients", current_users.len());
                    for (&_uid, tx) in current_users.iter() {
                        if let Err(_disconnected) = tx.send(Message::text(alert.to_string())) {
                            // The tx is disconnected, our `user_disconnected` code
                            // should be happening in another task, nothing more to do here.
                        }
                    }
                }
            }
            Err(err) => {
                // Handle the error by printing it to stderr
                error!("Error while getting an alert: {}", err);
            }
        }
        tokio::time::sleep(interval).await;
    }
}
