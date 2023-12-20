mod server;
use ctrlc;
use pretty_env_logger;
use clap::Parser;


#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[clap(short, long, default_value = "127.0.0.1")]
    /// The IP address to bind to.
    address: String,

    /// Number of times to greet
    #[clap(short, long, default_value = "3030")]
    /// The port to listen on.
    port: u16,

    #[clap(short, long, default_value = "false")]
    /// Use secure HTTPS connections.
    secure: bool,

    #[clap(short, long)]
    /// Path to the SSL certificate file.
    cert_path: Option<String>,

    #[clap(short, long)]
    /// Path to the SSL key file.
    key_path: Option<String>,

    #[clap(short, long, default_value = "false")]
    /// Enable mock mode.
    mock: bool,

    #[clap(long, default_value = "55s")]
    /// Interval for ws ping.
    ping_interval: humantime::Duration,

    #[clap(long, default_value = "1s")]
    /// Interval for quering new update.
    interval: humantime::Duration,

    #[clap(long, default_value = "/ws")]
    /// The ws path to bind to.
    ws_path: String,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();
    pretty_env_logger::init();
    ctrlc::set_handler(move || 
        std::process::exit(0)
    ).unwrap_or(());
    server::start(args).await;
}