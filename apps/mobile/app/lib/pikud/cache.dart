import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:magen/pikud/city.dart';
import 'package:magen/pikud/threat.dart';

class Threats {
  static final Threats _instance = Threats._internal();
  late Future<Map<String, Threat>> _threatsFuture;

  factory Threats() {
    return _instance;
  }

  Threats._internal() {
    _threatsFuture = _loadThreats();
  }

  Future<Map<String, Threat>> _loadThreats() async {
    String threatsStr = await rootBundle.loadString("assets/threats.json");
    Map<String, dynamic> threatsJSON = json.decode(threatsStr);
    
    Map<String, Threat> threatsMap = {};

    threatsJSON.forEach((key, value) {
      Threat threat = Threat.fromJSON(value);
      threatsMap[key] = threat;
    });

    return threatsMap;
  }

  Future<Map<String, Threat>> get threats async {
    return _threatsFuture;
  }
}

class Cities {
  static final Cities _instance = Cities._internal();
  late Future<List<City>> _citiesFuture;

  factory Cities() {
    return _instance;
  }

  Cities._internal() {
    _citiesFuture = _loadCities();
  }

  Future<List<City>> _loadCities() async {
    String citiesStr = await rootBundle.loadString("assets/cities.json");
    Map<String, dynamic> citiesJSON = json.decode(citiesStr);
    List<dynamic> citiesArray = citiesJSON["cities"];
    List<City> cities = citiesArray.map((json) => City.fromJSON(json)).toList();
    return cities;
  }

  Future<List<City>> get cities async {
    return _citiesFuture;
  }
}
