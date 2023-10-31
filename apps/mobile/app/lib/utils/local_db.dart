import 'dart:convert';
import 'package:app/models/city.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocalDB {
  static LocalDB? _instance;
  late final SharedPreferences _sharedPreferences;

  LocalDB._(this._sharedPreferences);

  static Future<LocalDB> getInstance() async {
    if (_instance == null) {
      var shared = await SharedPreferences.getInstance();
      _instance = LocalDB._(shared);
    }
    return _instance!;
  }

  Future<void> setCities(List<City> cities) async {
    final citiesJson = jsonEncode(cities.map((c) => c.toJson()).toList());
    await _sharedPreferences.setString("cities", citiesJson);
  }

  Future<List<City>> getCities() async {
    final citiesJson = _sharedPreferences.getString("cities");
    if (citiesJson != null) {
      final List<dynamic> cityList = jsonDecode(citiesJson);
      return cityList.map((cityData) => City.fromJson(cityData)).toList();
    } else {
      return [];
    }
  }

  Future<void> setToken(String token) async {
    await _sharedPreferences.setString("token", token);
  }

  Future<String?> getToken() async {
    return _sharedPreferences.getString("token");
  }
}
