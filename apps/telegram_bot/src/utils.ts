import pino from "pino";
import {
  ActiveAlert,
  OrefUpdate,
} from "../../packages/magen_common_ts/src/interfaces";
import {
  citiesJson,
  threatsJson,
} from "../../packages/magen_common_ts/src/lib";
import * as config from "./config";

export function getAlerts(update: OrefUpdate): ActiveAlert[] {
  const alerts: ActiveAlert[] = [];
  for (const city of update.cities) {
    alerts.push({
      is_test: update.is_test!,
      name: city,
      timestamp: new Date(),
      city: citiesJson?.[city],
      threat: threatsJson?.[update.category],
    });
  }
  return alerts;
}

export const logger = pino({
  name: config.appName,
  level: config.logLevel,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
