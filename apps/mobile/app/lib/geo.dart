import 'package:point_in_polygon/point_in_polygon.dart';


bool pointInPolygon(Point point, List<Point> polygon) {
  return Poly.isPointInPolygon(point, polygon);
}