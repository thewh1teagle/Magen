use pikud::Client;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut client = Client::new(Duration::from_secs(5));
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
