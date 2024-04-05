import 'dart:convert';
import 'package:flutter/services.dart';

class City {
  String id;
  String he;
  String en;
  String ru;
  String ar;
  String es;
  int area;
  int countdown;
  double lat;
  double lng;

  City({
    required this.id,
    required this.he,
    required this.en,
    required this.ru,
    required this.ar,
    required this.es,
    required this.area,
    required this.countdown,
    required this.lat,
    required this.lng,
  });

  static City fromJSON(Map<String, dynamic> json) {
    return City(
      id: json['id'],
      he: json['he'],
      en: json['en'],
      ru: json['ru'],
      ar: json['ar'],
      es: json['es'],
      area: json['area'],
      countdown: json['countdown'],
      lat: json['lat'].toDouble(),
      lng: json['lng'].toDouble(),
    );
  }
}

class Threat {
  String he;
  String en;

  Threat({
    required this.he,
    required this.en,
  });

  static Threat fromJSON(Map<String, dynamic> json) {
    return Threat(
      he: json['he'],
      en: json['en'],
    );
  }
}

class Area {
  String he;

  Area({
    required this.he,
  });

  static Area fromJSON(Map<String, dynamic> json) {
    return Area(
      he: json['he'],
    );
  }
}

Future<List<City>> loadCities() async {
  var citiesStr = await rootBundle.loadString("../../packages/magen-common/src/assets/cities.json");
  var citiesJSON = json.decode(citiesStr);
  List<dynamic> citiesArray = citiesJSON["cities"];
  List<City> cities = citiesArray.map((json) => City.fromJSON(json)).toList();
  return cities;
}

Future<Map<String, Threat>> loadThreats() async {
  String threatsStr = await rootBundle.loadString("packages/magen-common/src/assets/threats.json");
  Map<String, dynamic> threatsJSON = json.decode(threatsStr);
  
  Map<String, Threat> threatsMap = {};

  threatsJSON.forEach((key, value) {
    Threat threat = Threat.fromJSON(value);
    threatsMap[key] = threat;
  });

  return threatsMap;
}

List<City> filterCities(List<City> cities, List<String> ids) {
  return cities.where((c) => ids.contains(c.id)).toList();
}