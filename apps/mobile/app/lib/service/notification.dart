import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class Notifications {
  Future initNotifications() async {
    var plugin = FlutterLocalNotificationsPlugin();
    plugin
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
  }
}
