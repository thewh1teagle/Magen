import 'package:maps_toolkit/maps_toolkit.dart';


bool point_in_polygon(num lat, num long, List<List<double>> polygon) {
  List<LatLng> latLngPolygon = polygon.map((coords) {
    return LatLng(coords[0], coords[1]);
  }).toList();
  return PolygonUtil.containsLocationAtLatLng(lat, long, latLngPolygon, true);
}