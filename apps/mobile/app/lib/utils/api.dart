import 'dart:convert';

import 'package:app/models/city.dart';
import 'package:app/utils/local_db.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class API {
  late final LocalDB db;
  late final String apiURL;
  API._(this.db, this.apiURL);

  static Future<API> getInstance() async {
    var db = await LocalDB.getInstance();
    var apiURL = dotenv.env['API_URL']!;
    return API._(db, apiURL);
  }

  Future<String> register(List<City> cities) async {
    var url = Uri.parse("$apiURL/user/create");
    var token = await FirebaseMessaging.instance.getToken(vapidKey: "BPGC5DFTwNoKujhVc5kIv6NUqdXROm7WGjG2NAKpdbV-JZRqh_gb18xx3GewMKPgMxS3PWzVUgBwHZIDN_yj_hw");
    var citiesIds = cities.map((element) => element.id.toString()).toList();
    var body = jsonEncode({
      'fcm_token': token,
      'cities': citiesIds
    });
    await db.setCities(cities);
    var _response = await http
        .post(headers: {"Content-Type": "application/json"}, url, body: body);
    return token!;
  }
}
