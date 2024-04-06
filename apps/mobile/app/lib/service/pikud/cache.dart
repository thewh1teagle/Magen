import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:magen/service/pikud/city.dart';
import 'package:magen/service/pikud/threat.dart';

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
  late Future<Map<String, City>> _citiesFuture;

  factory Cities() {
    return _instance;
  }

  Cities._internal() {
    _citiesFuture = _loadCities();
  }

  Future<Map<String, City>> _loadCities() async {
    String citiesStr = await rootBundle.loadString("assets/cities.json");
    Map<String, dynamic> citiesJSON = json.decode(citiesStr);
    Map<String, dynamic> citiesMap = citiesJSON["cities"];

    Map<String, City> cities = {};

    cities["כל הארץ"] = City(id: "0", he: "כל הארץ");
    citiesMap.forEach((key, value) {
      cities[key] = City.fromJSON(value);
    });

    return cities;
  }

  Future<Map<String, City>> get cities async {
    return _citiesFuture;
  }
}
