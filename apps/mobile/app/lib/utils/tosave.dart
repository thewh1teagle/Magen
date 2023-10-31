// import 'package:app/models/city.dart';
// import 'package:app/shared.dart';
// import 'package:app/utils/local_db.dart';
// import 'package:awesome_notifications/awesome_notifications.dart';
// import 'package:firebase_messaging/firebase_messaging.dart';
// import 'package:flutter/material.dart';



// void func() async {
//   AwesomeNotifications().createNotification(
//       content: NotificationContent(
//     id: 10,
//     channelKey: 'basic_channel',
//     actionType: ActionType.Default,
//     category: NotificationCategory.Event,
//     fullScreenIntent: false,
//     autoDismissible: true,
//     wakeUpScreen: true,
//     title: 'אזעקה',
//     body: 'אזעקה במרחב',
//     criticalAlert: true,
//     displayOnBackground: true,
//     displayOnForeground: true,
//   ));

//   AwesomeNotifications().isNotificationAllowed().then((isAllowed) {
//     if (!isAllowed) {
//       // This is just a basic example. For real apps, you must show some
//       // friendly dialog box before call the request method.
//       // This is very important to not harm the user experience
//       AwesomeNotifications().requestPermissionToSendNotifications();
//     }
//   });

//   AwesomeNotifications().initialize(
//       // set the icon to null if you want to use the default app icon
//       null,
//       [
//         NotificationChannel(
//             importance: NotificationImportance.Max,
//             channelKey: 'basic_channel',
//             channelName: 'Basic notifications',
//             channelDescription: 'Notification channel for basic tests',
//             defaultColor: const Color(0xFF9D50DD),
//             ledColor: Colors.white)
//       ],
//       debug: true);

//   final messaging = FirebaseMessaging.instance;
//   FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

//   // final settings = await messaging.requestPermission(
//   //   alert: true,
//   //   announcement: true,
//   //   badge: true,
//   //   carPlay: true,
//   //   criticalAlert: true,
//   //   provisional: true,
//   //   sound: true,
//   // );
// }

// void getToken() async {
//   var newToken = await FirebaseMessaging.instance.getToken();
// }
