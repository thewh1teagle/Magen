#!/bin/bash

brew install websocat

# Run Docker container in the background
docker run -d -p 8090:8090 server -m -p 8090 -a 0.0.0.0

stop_docker_server() {
    echo "Stopping Docker server..."
    docker stop $(docker ps -q --filter ancestor=server)
}

# Trap Ctrl+C to stop Docker server before exiting
trap stop_docker_server EXIT
websocat ws://localhost:8090/ws
stop_docker_server