import classifyPoint from 'robust-point-in-polygon'
import * as interfaces from './interfaces'

import cities_raw_json from "./assets/cities.json";
import polygons_raw_json from "./assets/polygons.json";
import threats_raw_json from "./assets/threats.json"

const citiesJson = cities_raw_json.cities as interfaces.Cities
const areasJson = cities_raw_json.areas as interfaces.Areas
const polygonsJson = polygons_raw_json as unknown as interfaces.Polygons

// from https://www.oref.org.il/Shared/Ajax/GetAlertCategories.aspx
const threatsJson = threats_raw_json as interfaces.Threats


function pointInPolygon(polygon: interfaces.IPolygon, point: [number, number]) {
    return classifyPoint(polygon, point) != 1 // 1 means it's outside
}

export {
    pointInPolygon,
    interfaces,
    threatsJson,
    citiesJson,
    areasJson,
    polygonsJson,
}