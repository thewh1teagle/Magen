import 'dart:convert';
import 'package:app/models/polygon.dart';
import 'package:flutter/services.dart';
import 'package:maps_toolkit/maps_toolkit.dart';

bool pointInPolygon(num lat, num lng, List<List<double>> polygon) {
  List<LatLng> latLngPolygon = polygon.map((coords) {
    return LatLng(coords[0], coords[1]);
  }).toList();
  return PolygonUtil.containsLocationAtLatLng(lat, lng, latLngPolygon, true);
}

Future<String?> cityByLoc(double lat, double lng) async {
  var polygonsStr = await rootBundle.loadString('assets/polygons.json');
  var data = jsonDecode(polygonsStr);

  data.forEach((key, dynamicPolygon) {
    var polygon = Polygon.fromDynamic(dynamicPolygon);
    if (pointInPolygon(lat, lng, polygon.data)) {
      return key;
    }
  });
  return null;
}
