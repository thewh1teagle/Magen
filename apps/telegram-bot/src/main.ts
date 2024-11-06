import WebSocket from "ws";
import { OrefUpdate } from "../../packages/magen-common/src/interfaces";
import { sendAlerts } from "./bot";
import * as config from "./config";
import { EventQueue } from "./EventQueue";
import log from "./log";
import { getAlerts } from "./utils";

const queue = new EventQueue(sendAlerts);

function connect() {
  log.info("WS connecting");
  let conn = new WebSocket(config.wsURL, {
    perMessageDeflate: false,
  });
  log.info("WS connected");
  return conn;
}

async function onMessage(message: WebSocket.MessageEvent) {
  log.debug(message.data);
  const update = JSON.parse(message.data.toString()) as OrefUpdate;
  const alerts = getAlerts(update);
  queue.enqueue(alerts);
}

async function main() {
  log.info("Running");
  let socket = connect();
  socket.addEventListener("message", onMessage);
  socket.addEventListener("close", () => {
    setTimeout(() => {
      log.info("WS disconnected");
      socket = connect(); // reconnect
    }, 2000);
  });
}
main();
