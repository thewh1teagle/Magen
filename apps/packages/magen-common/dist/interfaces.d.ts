export interface OrefUpdate {
    id: string;
    cities: Array<string>;
    category: string;
    is_test?: boolean;
}
export interface ActiveAlert {
    name: string;
    timestamp: Date;
    city?: City;
    threat?: Threat;
    is_test: boolean;
}
export interface Threat {
    he: string;
    en: string;
}
export interface Threats {
    [id: string]: Threat;
}
export type LatLng = [number, number];
export type IPolygon = LatLng[];
export interface Polygons {
    [id: string]: IPolygon;
}
export interface Area {
    he: string;
    en: string;
}
export interface City {
    id: number;
    he: string;
    en: string;
    ru: string;
    ar: string;
    es: string;
    area: number;
    countdown: number;
    lat: number;
    lng: number;
}
export interface Cities {
    [name: string]: City;
}
export interface Areas {
    [name: string]: Area;
}
//# sourceMappingURL=interfaces.d.ts.map