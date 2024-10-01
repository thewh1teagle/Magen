FROM rust:1.81.0 AS builder
WORKDIR /src
COPY . .
RUN cargo build --release

# We do not need the Rust toolchain to run the binary!
FROM debian:bookworm-slim AS runtime
RUN apt-get update -y
RUN apt-get install ca-certificates -y
WORKDIR /app
COPY --from=builder /src/target/release/server /app/server
EXPOSE 3030
ENTRYPOINT ["/app/server"]