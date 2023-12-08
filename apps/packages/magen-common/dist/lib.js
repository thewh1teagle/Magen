"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.polygonsJson = exports.areasJson = exports.citiesJson = exports.threatsJson = exports.interfaces = exports.pointInPolygon = void 0;
const robust_point_in_polygon_1 = __importDefault(require("robust-point-in-polygon"));
const interfaces = __importStar(require("./interfaces"));
exports.interfaces = interfaces;
const cities_json_1 = __importDefault(require("./assets/cities.json"));
const polygons_json_1 = __importDefault(require("./assets/polygons.json"));
const threats_json_1 = __importDefault(require("./assets/threats.json"));
const citiesJson = cities_json_1.default.cities;
exports.citiesJson = citiesJson;
const areasJson = cities_json_1.default.areas;
exports.areasJson = areasJson;
const polygonsJson = polygons_json_1.default;
exports.polygonsJson = polygonsJson;
// from https://www.oref.org.il/Shared/Ajax/GetAlertCategories.aspx
const threatsJson = threats_json_1.default;
exports.threatsJson = threatsJson;
function pointInPolygon(polygon, point) {
    return (0, robust_point_in_polygon_1.default)(polygon, point) != 1; // 1 means it's outside
}
exports.pointInPolygon = pointInPolygon;
