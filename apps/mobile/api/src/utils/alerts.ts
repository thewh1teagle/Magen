import WebSocket from "ws";
import * as config from "../config";
import { findUsers } from "./geo";
import { FastifyInstance } from "fastify";
import { sendPush } from "./firebase";
import { ActiveAlert, OrefUpdate } from "@magen/common/src/interfaces";
import { citiesJson, polygonsJson, threatsJson } from "@magen/common";

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
    let users = await findUsers(alerts);
    users = users?.filter(u => u.fcm_token !== undefined && u.fcm_token !== null)
    
    const citiesIds = JSON.stringify(alerts.map(a => a.city?.id).flatMap(id => id ? [id] : []))
    if (citiesIds.length > 0 && users && users?.length > 0) {
      // console.log('sending to ', users)
      // console.log(citiesIds);
      sendPush({
        token: users?.map((u) => u.fcm_token),
        data: {ids: citiesIds, threat: update.category},
      });
    }
  });
}
