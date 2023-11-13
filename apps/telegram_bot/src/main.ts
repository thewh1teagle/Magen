import WebSocket from "ws";
import { OrefUpdate } from "../../packages/magen_common_ts/src/interfaces";
import { sendAlerts } from "./bot";
import * as config from "./config";
import { getAlerts, logger } from "./utils";
import { EventQueue } from "./EventQueue";

const queue = new EventQueue(sendAlerts)

function connect() {
  logger.info('WS connecting')
    let conn = new WebSocket(config.wsURL, {
        perMessageDeflate: false,
    });
    logger.info('WS connected')
    return conn
}

async function onMessage(message: WebSocket.MessageEvent) {
  logger.debug(message.data)
  const update = JSON.parse(message.data.toString()) as OrefUpdate;
  const alerts = getAlerts(update)
  queue.enqueue(alerts)
}

async function main() {
  logger.info("Running")
  let socket = connect()
  socket.addEventListener("message", onMessage);
  socket.addEventListener('close', () => {
      setTimeout(() => {
          logger.info('WS disconnected')
          socket = connect() // reconnect
      }, 2000)
  })
}
main()
