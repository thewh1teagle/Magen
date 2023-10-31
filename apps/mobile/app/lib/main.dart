import 'dart:convert';

import 'package:app/firebase_options.dart';
import 'package:app/models/city.dart';
import 'package:app/routes/home.dart';
import 'package:app/shared.dart';
import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'utils/local_db.dart';


Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print("got message ${message.data['ids']}");
  var db = await LocalDB.getInstance();
  var shared = await Shared.getInstance();
  List<City> cities = await db.getCities();
  print("cities: ${cities.first.id}");

  var threatID = message.data["threat"] as String;
  var idsString = message.data["ids"];
  var idsArray = jsonDecode(idsString);
  var filtered = cities.where((city) => idsArray.contains(city.id.toString()));
  var citiesString = filtered.map((city) => city.he).join(",");
  var threat = shared.threats[threatID];

  AwesomeNotifications().createNotification(
      content: NotificationContent(
        icon: "resource://drawable/res_launcher_icon",
    id: 10,
    channelKey: 'basic_channel',
    actionType: ActionType.Default,
    category: NotificationCategory.Event,
    fullScreenIntent: false,
    autoDismissible: true,
    wakeUpScreen: true,
    title: threat?.he ?? 'אזעקה',
    body: citiesString,
    criticalAlert: true,
    displayOnBackground: true,
    displayOnForeground: true,
  ));
}

Future<void> init() async {
  WidgetsFlutterBinding.ensureInitialized();

  AwesomeNotifications().initialize(
      // set the icon to null if you want to use the default app icon
      null,
      [
        NotificationChannel(
            importance: NotificationImportance.Max,
            channelKey: 'basic_channel',
            channelName: 'Basic notifications',
            channelDescription: 'Notification channel for basic tests',
            defaultColor: const Color(0xFF9D50DD),
            ledColor: Colors.white)
      ],
      debug: true);
  AwesomeNotifications().isNotificationAllowed().then((isAllowed) {
    if (!isAllowed) {
      // This is just a basic example. For real apps, you must show some
      // friendly dialog box before call the request method.
      // This is very important to not harm the user experience
      AwesomeNotifications().requestPermissionToSendNotifications();
    }
  });

  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
  await dotenv.load(fileName: ".env");
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
}

void main() async {
  await init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Magen',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const Directionality(
              textDirection: TextDirection.rtl,
              child: HomeRoute(),
            )
      },
    );
  }
}
