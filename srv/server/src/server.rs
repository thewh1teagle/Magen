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
        alert_notify_task(args.interval.into())
    );
    tokio::spawn(
        send_ping_task(args.ping_interval.into())
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
    ws.on_upgrade(move |socket| user_connected(socket, addr))
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

async fn handle_message(msg: &String, tx: UnboundedSender<Message>,) {
    if let Ok(msg_data) = serde_json::from_str::<serde_json::Value>(&msg) {
        let maybe_action = msg_data.get("action").and_then(|a| a.as_str());
        if let Some(action) = maybe_action {
            match action {
                "test" => {
                    let client = CLIENT.lock().await;
                    let result = tx.send(Message::Text(client.get_mock_alert().to_string()));
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

async fn receiver_task(
    my_id: usize,
    mut user_ws_rx: SplitStream<WebSocket>,
    tx: UnboundedSender<Message>,
) {
    while let Some(result) = user_ws_rx.next().await {
        match result {
            Ok(msg) => {
                match msg {
                    Message::Text(msg) => {
                        handle_message(&msg, tx.clone()).await;
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

async fn user_connected(ws: WebSocket, addr: SocketAddr) {
    debug!("New connection from {addr}");
    // Use a counter to assign a new unique ID for this user.
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    // Split the socket into a sender and receive of messages.
    let (user_ws_tx, user_ws_rx) = ws.split();
    
    // Use an unbounded channel to handle buffering and flushing of messages
    // to the websocket...
    let (tx, rx) = mpsc::unbounded_channel();
    let rx = UnboundedReceiverStream::new(rx);

    tokio::task::spawn(sender_task(rx, user_ws_tx));


    // Save the sender in our list of connected USERS.
    USERS.write().await.insert(my_id, tx.clone());

    receiver_task(my_id, user_ws_rx, tx).await;
    // disconnect when receiver stopping
    user_disconnected(my_id).await;
}

async fn user_disconnected(my_id: usize) {
    // Stream closed up, so remove from the user list
    USERS.write().await.remove(&my_id);
}

async fn send_ping_task(interval: Duration) {
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

async fn alert_notify_task(
    interval: Duration
) -> Result<(), Box<dyn std::error::Error + Send>> {
    loop {
        match CLIENT.lock().await.get_alert().await {
            Ok(maybe_alert) => {
                if let Some(alert) = maybe_alert {
                    let current_users = USERS.read().await;
                    debug!("sending alert to {} clients", current_users.len());
                    for (&_uid, tx) in current_users.iter() {
                        if let Err(_disconnected) = tx.send(Message::Text(alert.to_string())) {
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
