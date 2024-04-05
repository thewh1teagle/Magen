import 'package:firebase_messaging/firebase_messaging.dart';

class FirebaseAPI {
  final _messaging = FirebaseMessaging.instance;
  Future<void> initNotifications() async {
    await _messaging.requestPermission();
    final fcmToken = await _messaging.getToken();
    print("token: $fcmToken");

    // When app visible
    FirebaseMessaging.onMessage.listen(onMessageReceived);
  }

  Future<void> onMessageReceived(RemoteMessage message) async {}
}
