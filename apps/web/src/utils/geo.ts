import classifyPoint from 'robust-point-in-polygon'
import { IPolygon } from '../../../data/src/interfaces'

export function pointInPolygon(polygon: IPolygon, point: [number, number]) {
    return classifyPoint(polygon, point) != 1 // 1 means it's outside
}