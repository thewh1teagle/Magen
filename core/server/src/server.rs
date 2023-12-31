use crate::Args;
use pikud;
use serde_json;
use log::{debug, error};
use tokio::{time::Duration, sync::{mpsc::{self, UnboundedSender}, Mutex, RwLock}};
use tokio_stream::wrappers::UnboundedReceiverStream;
use futures_util::{SinkExt, StreamExt, TryFutureExt, stream::{SplitSink, SplitStream}};
use once_cell::sync::Lazy;
use std::net::SocketAddr;
use tower_http::trace::{DefaultMakeSpan, TraceLayer};
//allows to extract the IP of connecting user
use axum::extract::connect_info::ConnectInfo;
use std::{collections::HashMap,sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
}};
use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};


/// Our global unique user id counter.
static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);
type Users = Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Message>>>>;
static USERS: Lazy<Arc<tokio::sync::RwLock<HashMap<usize, UnboundedSender<axum::extract::ws::Message>>>>> = Lazy::new(|| {
    Users::default()
}); 
static CLIENT: Lazy<Arc<tokio::sync::Mutex<pikud::Client>>> = Lazy::new(|| {
    Arc::new(Mutex::new(pikud::Client::new()))
}); 

pub async fn start(args: Args) {
    
    if args.mock { // default to non mock
        *CLIENT.lock().await = pikud::Client::new_mock();
    }
    let app = Router::new()
    .route(&args.ws_path, get(ws_handler))
    // logging so we can see whats going on
    .layer(
        TraceLayer::new_for_http()
            .make_span_with(DefaultMakeSpan::default().include_headers(true)),
    );

    let listener = tokio::net::TcpListener::bind(format!("{}:{}", args.address, args.port))
        .await
        .unwrap();

    tokio::spawn(
        send_alerts_task(args.interval.into())
    );
    tokio::spawn(
        keep_alive_task(args.ping_interval.into())
    );

    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
    
    // TODO: support secure wss
    // let default_cert_bytes = include_bytes!("../assets/default_cert.pem");
    // let default_key_bytes = include_bytes!("../assets/default_key.rsa");

}


async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    // finalize the upgrade process by returning upgrade callback.
    // we can customize the callback by sending additional info such as address.
    ws.on_upgrade(move |socket| on_user_connected(socket, addr))
}

async fn on_message_received(msg: &String, tx: UnboundedSender<Message>,) {
    if let Ok(msg_data) = serde_json::from_str::<serde_json::Value>(&msg) {
        let maybe_action = msg_data.get("action").and_then(|a| a.as_str());
        if let Some(action) = maybe_action {
            match action {
                "test" => {
                    let client = CLIENT.lock().await;
                    let mock_alert = client.get_mock_alert();
                    drop(client); // release lock as soon as possible
                    let result = tx.send(Message::Text(mock_alert.to_string()));
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
}

async fn on_user_connected(ws: WebSocket, addr: SocketAddr) {
    debug!("New connection from {addr}");
    // Use a counter to assign a new unique ID for this user.
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    // Split the socket into a sender and receive of messages.
    let (user_ws_tx, user_ws_rx) = ws.split();
    
    // Use an unbounded channel to handle buffering and flushing of messages
    // to the websocket...
    let (tx, rx) = mpsc::unbounded_channel();
    let rx = UnboundedReceiverStream::new(rx);

    // Save the sender in our list of connected USERS.
    USERS.write().await.insert(my_id, tx.clone());

    tokio::task::spawn(sender_task(rx, user_ws_tx));
    receiver_task(my_id, user_ws_rx, tx).await;
    // disconnect when receiver stopping
    on_user_disconnected(my_id).await;
}

async fn on_user_disconnected(my_id: usize) {
    // Stream closed up, so remove from the user list
    USERS.write().await.remove(&my_id);
}



async fn notify_users(alert: pikud::Alert) {
    // send the actual alert to users
    let current_users = USERS.read().await;
    debug!("sending alert to {} clients", current_users.len());
    for (&_uid, tx) in current_users.iter() {
        if let Err(_disconnected) = tx.send(Message::Text(alert.to_string())) {
            // The tx is disconnected, our `user_disconnected` code
            // should be happening in another task, nothing more to do here.
        }
    }
}

async fn receiver_task(
    my_id: usize,
    mut rx: SplitStream<WebSocket>,
    tx: UnboundedSender<Message>,
) {
    // Receive message from user
    while let Some(result) = rx.next().await {
        match result {
            Ok(msg) => {
                match msg {
                    Message::Text(msg) => {
                        on_message_received(&msg, tx.clone()).await;
                    },
                    _ => {}
                }
            },
            Err(e) => {
                debug!("websocket error(uid={}): {}", my_id, e);
                break;
            }
        };
    }
}

async fn sender_task(mut rx: UnboundedReceiverStream<Message>, mut tx: SplitSink<WebSocket, Message>) {
    // send message to user
    while let Some(message) = rx.next().await {
        tx
            .send(message)
            .unwrap_or_else(|e| {
                debug!("websocket send error: {}", e);
            })
            .await;
    }
}

async fn keep_alive_task(interval: Duration) {
    // keep users alive with pings
    loop {
        for (&_uid, tx) in USERS.read().await.iter() {
            if let Err(_disconnected) = tx.send(Message::Ping(vec![])) {
                // The tx is disconnected, our `user_disconnected` code
                // should be happening in another task, nothing more to do here.
            }
        }
        // Continue after waiting
        tokio::time::sleep(interval).await;
    }
}

async fn send_alerts_task(
    interval: Duration
) -> Result<(), Box<dyn std::error::Error + Send>> {
    // Send pikud alert to users when there's
    loop {
        let mut client = CLIENT.lock().await;
        let alert = client.get_alert().await;
        drop(client); // release client immediately
        match alert {
            Ok(maybe_alert) => {
                if let Some(alert) = maybe_alert {
                    notify_users(alert).await;
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
