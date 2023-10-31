import 'dart:convert';

import 'package:app/models/city.dart';
import 'package:app/models/polygon.dart';
import 'package:app/models/threats.dart';
import 'package:app/utils/json.dart';
import 'package:flutter/services.dart';

class Shared {
  static final Shared _shared = Shared._internal();
  Map<String, City> cities = {};
  Map<String, Polygon> polygons = {};
  Map<String, Threat> threats = {};

  factory Shared() {
    return _shared;
  }

  Shared._internal();

  // Create an asynchronous method to initialize the singleton
  static Future<Shared> getInstance() async {
    await _shared._initialize();
    return _shared;
  }

  Future<void> _initialize() async {
    Map<String, dynamic> citiesMap = await readJson("assets/cities.json");
    Map<String, dynamic> polygonsJson = await readJson("assets/polygons.json");
    Map<String, dynamic> threatsJson = await readJson("assets/threats.json");

    // Load cities
    Map<String, dynamic> citiesInnerMap = citiesMap["cities"];
    cities = Map<String, City>.fromEntries(
        citiesInnerMap.entries.map<MapEntry<String, City>>((entry) {
      var key = entry.key;
      var json = entry.value as Map<String, dynamic>;
      var city = City.fromJson(json);
      
      return MapEntry(key, city);
    }));

    // Load Polygons
    polygons = Map<String, Polygon>.fromEntries(
      polygonsJson.entries.map((entry) {
        var key = entry.key;
        var json = entry.value;
        var polygon = Polygon.fromJson(json);
        return MapEntry(key, polygon);
      }),
    );

    // Load threats
    threats = Map<String, Threat>.fromEntries(
      threatsJson.entries.map((entry) {
        var key = entry.key;
        var json = entry.value;
        var threat = Threat.fromJson(json);
        return MapEntry(key, threat);
      }),
    );
  }
}
