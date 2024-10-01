use pikud::Client;
use tokio::time::{sleep, Duration};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();
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
