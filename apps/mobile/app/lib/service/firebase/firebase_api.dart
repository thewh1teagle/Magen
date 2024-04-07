import 'dart:convert';

import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:magen/service/pikud/cache.dart';

class FirebaseAPI {
  final _messaging = FirebaseMessaging.instance;
  Future<void> initNotifications() async {
    await _messaging.requestPermission();
    final fcmToken = await _messaging.getToken();
    print("token: $fcmToken");

    // When app visible
    FirebaseMessaging.onMessage.listen(onMessageReceived);
  }

  Future<String?> getToken() async {
    return await _messaging.getToken();
  }

  Future<void> onMessageReceived(RemoteMessage message) async {
    print("received message ${message.data}");
    var cities = await Cities().cities;
    var threats = await Threats().threats;
    var activeThreat = threats[message.data["threat"].toString()];
    var activeCitiesIDS = (json.decode(message.data["ids"]) as List<dynamic>)
        .map((id) => id.toString())
        .toList();
    var activeCities =
        cities.values.where((c) => activeCitiesIDS.contains(c.id)).toList();
    AwesomeNotifications().createNotification(
        content: NotificationContent(
      id: 10,
      channelKey: 'basic_channel',
      actionType: ActionType.Default,
      title: activeThreat?.he ?? "התראה חדשה",
      body: activeCities.map((e) => e.he).join(", "),
    ));
  }
}
