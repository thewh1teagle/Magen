import 'package:magen/pikud/cache.dart';
import 'package:magen/pikud/city.dart';
import 'package:magen/pikud/threat.dart';

class Alert {
  List<City> cities;
  Threat threat;

  Alert({
    required this.cities,
    required this.threat,
  });

  static Future<Alert> fromJSON(Map<String, dynamic> json) async {
    String threatID = json["threat"];
    List<String> citiesIDS = json["cities"];
    var threats = await Threats().threats;
    var cities = await Cities().cities;
    var threat = threats[threatID] ?? Threat(he: "לא ידוע", en: "Uknown");
    var activeCities = cities.where((city) => citiesIDS.contains(city.id)).toList();
    return Alert(cities: activeCities, threat: threat);
  }
}