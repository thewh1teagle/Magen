import 'package:app/firebase_options.dart';
import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:app/utils/api.dart' as api;
import 'package:shared_preferences/shared_preferences.dart';

Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print("received: ${message.data['ids']}");
  final SharedPreferences prefs = await SharedPreferences.getInstance();

  AwesomeNotifications().createNotification(
      content: NotificationContent(
        id: 10,
        channelKey: 'basic_channel',
        actionType: ActionType.Default,
        category: NotificationCategory.Event,
        fullScreenIntent: false,
        autoDismissible: true,
        wakeUpScreen: true,
        title: 'אזעקה',
        body: 'אזעקה במרחב',
        criticalAlert: true,
        displayOnBackground: true,
        displayOnForeground: true,
  ));
}

void main() async {

  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  
  AwesomeNotifications().isNotificationAllowed().then((isAllowed) {
    if (!isAllowed) {
      // This is just a basic example. For real apps, you must show some
      // friendly dialog box before call the request method.
      // This is very important to not harm the user experience
      AwesomeNotifications().requestPermissionToSendNotifications();
    }
  });


    AwesomeNotifications().initialize(
      // set the icon to null if you want to use the default app icon
      null,
      [
        NotificationChannel(
          importance: NotificationImportance.Max,
            channelKey: 'basic_channel',
            channelName: 'Basic notifications',
            channelDescription: 'Notification channel for basic tests',
            defaultColor: Color(0xFF9D50DD),
            ledColor: Colors.white)
      ],
      debug: true);
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) {
    print("error $e");
  }


  await api.register();
  // var token = await FirebaseMessaging.instance.getToken();
  // if (token != null) {
  //   print(token);
  // } else {
  //   print("token is null");
  // }

  final messaging = FirebaseMessaging.instance;
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  final settings = await messaging.requestPermission(
    alert: true,
    announcement: true,
    badge: true,
    carPlay: true,
    criticalAlert: true,
    provisional: true,
    sound: true,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a blue toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  String token = "init";
  BehaviorSubject<RemoteMessage>? _messageStreamController;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  void getToken() async {
    var newToken = await FirebaseMessaging.instance.getToken();
    setState(() {
      token = newToken ?? "is null";
    });
  }

  @override
  void initState() {
    getToken();
    // _messageStreamController = BehaviorSubject<RemoteMessage>();
    // _messageStreamController?.listen((value) {
    //   print("new message");
    //   print(value);
    // });
    // FirebaseMessaging.onMessage.listen((event) {
    //   // print(event.data);
    // });
    // FirebaseMessaging.onBackgroundMessage((message) async {
    //   print(message.data);
    // });
    // FirebaseMessaging.onMessageOpenedApp.listen((event) {
    //   // print(event.data);
    // });
    // TODO: implement initState

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          // TRY THIS: Try changing the color here to a specific color (to
          // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
          // change color while the other colors stay the same.
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          // Here we take the value from the MyHomePage object that was created by
          // the App.build method, and use it to set our appbar title.
          title: Text(widget.title),
        ),
        body: Column(
          children: [
            ElevatedButton(onPressed: () {}, child: Text(token)),
            SelectableText(
              token,
              style: TextStyle(color: Colors.black),
            )
          ],
        ));
  }
}
