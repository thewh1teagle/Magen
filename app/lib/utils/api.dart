import 'dart:convert';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


Future<String> register() async {
  var apiURL = dotenv.env['API_URL'];
  print("apiURL $apiURL");
  var url = Uri.parse("${apiURL!}/user/create");
  var token = await FirebaseMessaging.instance.getToken();
  print("token $token");
  var body = jsonEncode({'fcm_token': token, 'cities': ["127"]});
  print("body: $body");
  var response = await http.post(
    headers: {"Content-Type": "application/json"},
    url, 
    body: body
  );
  print(response);
  return "";
}