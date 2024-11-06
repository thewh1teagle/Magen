import { format } from "date-fns";
import { Bot, InputFile } from "grammy";
import { Area } from "../../packages/magen-common/src/interfaces";
import { areasJson, citiesJson } from "../../packages/magen-common/src/lib";
import { getAlertsImage } from "../../packages/static-map/src/lib";
import * as config from "./config";
import log from "./log";
import { ActiveAlert } from "./src/interfaces";

const bot = new Bot(config.botToken!);

function createMessage(alerts: ActiveAlert[]): string {
  const date = new Date();
  const formattedDate = format(date, "dd/MM/yyyy | HH:mm:ss");

  let text = "";
  if (alerts?.[0].is_test) {
    text += "*בדיקה* *בדיקה* *בדיקה* *בדיקה* *בדיקה*\n\n";
  }
  text += `🔴 ${alerts?.[0].threat!.he} (${formattedDate})\n\n`;
  const areasData: { [id: string]: ActiveAlert[] } = {};

  for (const alert of alerts) {
    const areaID = alert.city?.area;
    if (areaID) {
      const area: Area = citiesJson?.[areaID];
      if (areasData[areaID]) {
        areasData[areaID].push(alert);
      } else {
        areasData[areaID] = [alert];
      }
    }
  }
  for (const areaID in areasData) {
    const alerts: ActiveAlert[] = areasData[areaID];

    const areaData = areasJson?.[areaID];
    text += `*${areaData?.he}*: ${alerts.map((a) => a.city!.he).join(", ")} (${
      alerts?.[0].city?.countdown
    } שניות)\n\n`;
  }
  text += `\n\n[מגן - צבע אדום](https://t.me/MagenAlerts)`;
  return text;
}

export async function sendAlerts(alerts: ActiveAlert[]) {
  log.info(
    `Sending ${alerts.length} alerts: ${alerts
      .map((a) => a?.city?.he)
      .join(",")}`
  );
  await bot.api.sendMessage(config.channelID, createMessage(alerts), {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  });
  const image = await getAlertsImage(alerts);
  bot.api.sendPhoto(config.channelID, new InputFile(image));
}
