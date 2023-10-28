import { Areas, Cities, Polygons, Threats } from "./interfaces";

import cities_raw_json from "./assets/cities.json";
import polygons_raw_json from "./assets/polygons.json";
import threats_raw_json from "./assets/threats.json"

export const citiesJson = cities_raw_json.cities as Cities
export const areasJson = cities_raw_json.areas as Areas
export const polygonsJson = polygons_raw_json as unknown as Polygons

// from https://www.oref.org.il/Shared/Ajax/GetAlertCategories.aspx
export const threatsJson = threats_raw_json as Threats