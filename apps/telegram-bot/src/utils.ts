import {
  ActiveAlert,
  OrefUpdate,
} from "../../packages/magen-common/src/interfaces";
import { citiesJson, threatsJson } from "../../packages/magen-common/src/lib";

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
