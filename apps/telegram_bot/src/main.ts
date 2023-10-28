import { Bot, InputFile } from "grammy";
import WebSocket from "ws";
import * as config from "./config";
import { ActiveAlert, OrefUpdate } from "../../packages/magen_common_ts/src/interfaces";
import { createMessage, getActiveAlerts } from "./utils";
import {getAlertsImage} from "../../packages/static_map/src/lib"
import { citiesJson } from "../../packages/magen_common_ts/src/lib";
import fs from 'fs'

const bot = new Bot(config.botToken!);


function connect() {
    let conn = new WebSocket(config.wsURL, {
        perMessageDeflate: false,
    });
    return conn
}

async function onMessage(message: WebSocket.MessageEvent) {
  const update = JSON.parse(message.data.toString()) as OrefUpdate;
  
  const alerts = getActiveAlerts(update)
  await bot.api.sendMessage(config.ChannelID, createMessage(alerts), {
    parse_mode: "Markdown",
    disable_web_page_preview: true
  });
  const image = await getAlertsImage(alerts)
  bot.api.sendPhoto(config.ChannelID, new InputFile(image))
}

let socket = connect()
socket.addEventListener("message", onMessage);
socket.addEventListener('close', () => {
    setTimeout(() => {
        socket = connect()
    }, 2000)
})
