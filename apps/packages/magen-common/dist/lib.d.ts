import * as interfaces from './interfaces';
declare const citiesJson: interfaces.Cities;
declare const areasJson: interfaces.Areas;
declare const polygonsJson: interfaces.Polygons;
declare const threatsJson: interfaces.Threats;
declare function pointInPolygon(polygon: interfaces.IPolygon, point: [number, number]): boolean;
export { pointInPolygon, interfaces, threatsJson, citiesJson, areasJson, polygonsJson, };
//# sourceMappingURL=lib.d.ts.map