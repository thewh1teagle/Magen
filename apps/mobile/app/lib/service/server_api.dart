import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ServerAPI {
  late String baseURL;

  ServerAPI() {
    baseURL = dotenv.env['SERVER_URL'] ?? '';

    if (baseURL.isEmpty) {
      throw Exception('SERVER_URL is not set in the .env file');
    }
  }

  Future<void> healthCheck() async {
    final response = await http.get(
      Uri.parse('$baseURL/api/healthcheck'),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to set data');
    }
  }

  Future<void> set(String fcmToken, List<String> cities) async {
    final response = await http.post(
      Uri.parse('$baseURL/api/user/set'),
      body: jsonEncode({'fcm_token': fcmToken, 'cities': cities}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to set data');
    }
  }

  Future<void> test(String fcmToken) async {
    final response = await http.post(
      Uri.parse('$baseURL/api/user/test'),
      body: jsonEncode({'fcm_token': fcmToken}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to send test');
    }
  }

  Future<void> unset(String fcmToken) async {
    final response = await http.post(
      Uri.parse('$baseURL/api/user/unset'),
      body: jsonEncode({'fcm_token': fcmToken}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to unset data');
    }
  }
}
