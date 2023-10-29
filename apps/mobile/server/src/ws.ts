import WebSocket from "ws";
import * as config from "./config";
import { citiesJson, polygonsJson, threatsJson } from "../../../packages/magen_common_ts/src/lib";
import { ActiveAlert, OrefUpdate } from "../../../packages/magen_common_ts/src/interfaces";
import { findUsers } from "./utils/geo";
import { FastifyInstance } from "fastify";
import { sendPush } from "./firebase";

export const socket = new WebSocket(config.wsURL, {
  perMessageDeflate: false,
});

export function parseAlerts(update: OrefUpdate): ActiveAlert[] {
  return update.cities.map((city) => {
    const cityData = citiesJson?.[city];
    return {
      is_test: update.is_test ?? false,
      name: city,
      timestamp: new Date(),
      threat: threatsJson?.[update.category],
      city: cityData,
      polygon: polygonsJson?.[cityData?.id],
    };
  });
}

export function startListen(app: FastifyInstance) {
  socket.addEventListener("message", async (message) => {
    const update = JSON.parse(message.data as string) as OrefUpdate;
    const alerts = parseAlerts(update);
    const users = await findUsers(app, alerts);
    const citiesIds = JSON.stringify(alerts.map(a => a.city?.id).flatMap(id => id ? [id.toString()] : []))
    console.log('ids => ', citiesIds)
    if (citiesIds.length > 0 && users && users?.length > 0) {
      console.log('sending to ', users.map(u => u.fcm_token))
      sendPush({
        token: users?.map((u) => u.fcm_token),
        data: {ids: citiesIds},
      });
    }
  });
}
