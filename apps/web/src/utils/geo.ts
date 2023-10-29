import classifyPoint from 'robust-point-in-polygon'
import { IPolygon } from '../../../packages/magen_common_ts/src/interfaces'

export function pointInPolygon(polygon: IPolygon, point: [number, number]) {
    return classifyPoint(polygon, point) != 1 // 1 means it's outside
}