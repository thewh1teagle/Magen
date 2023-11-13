
use oref::Client;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut client = Client::new();
    loop {
        match client.get_alert().await {
            Ok(alert) => {
                if let Some(alert) = alert {
                    println!("alert: {:?}", alert);
                }
            }
            Err(err) => {
                eprintln!("Error: {:?}", err);
            }
        }
        sleep(Duration::from_secs(1)).await;
    }
}