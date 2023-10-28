# oref-ws

Fast and efficient web socket server for `pikud haoref` `API`


## Build
```shell
cargo build --release
```

## Usage
All options are optional. 
```shell
Usage: oref-ws.exe [OPTIONS]

Options:
  -a, --address <ADDRESS>      The IP address to bind to [default: 127.0.0.1]
  -p, --port <PORT>            Number of times to greet The port to listen on [default: 3030]
  -s, --secure                 Use secure HTTPS connections
  -c, --cert-path <CERT_PATH>  Path to the SSL certificate file
  -k, --key-path <KEY_PATH>    Path to the SSL key file
  -m, --mock                   Enable mock mode
  -h, --help                   Print help
  -V, --version                Print version
```

## Connecting
Use [websocat](https://github.com/vi/websocat/releases) to test.

Run the server with mock data
```shell
oref-ws.exe --mock
```
Then connect with
```shell
websocat.exe ws://127.0.0.1:3030/ws
```