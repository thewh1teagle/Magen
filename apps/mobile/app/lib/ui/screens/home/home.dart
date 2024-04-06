import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:magen/service/firebase/firebase_api.dart';
import 'package:magen/service/notification.dart';
import 'package:magen/service/server_api.dart';
import 'package:magen/ui/components/CustomSliverAppBar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Future<void> _showNotificationWithActions() async {
    var plugin = FlutterLocalNotificationsPlugin();
    const AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
      '...',
      '...',
      actions: <AndroidNotificationAction>[
        AndroidNotificationAction('id_1', 'Action 1'),
        AndroidNotificationAction('id_2', 'Action 2'),
        AndroidNotificationAction('id_3', 'Action 3'),
      ],
    );
    const NotificationDetails notificationDetails =
        NotificationDetails(android: androidNotificationDetails);
    await plugin.show(0, '...', '...', notificationDetails);
  }

  @override
  void initState() {
    Notifications().initNotifications();
    super.initState();
  }

  Future testAlert() async {
    _showNotificationWithActions();
    var token = await FirebaseAPI().getToken();
    if (token != null) {
      ServerAPI().test(token);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: CustomScrollView(
      slivers: [
        const CustomSliverAppBar(
          isMainView: true,
          title: Padding(
            padding: EdgeInsets.all(10.0),
            child: Text(
              "התראות",
              style: TextStyle(fontSize: 24, color: Colors.black),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.all(20.0),
          sliver: SliverList(
            delegate: SliverChildListDelegate.fixed(
              [
                const Text("לא התקבלו התראות חדשות"),
                const SizedBox(height: 10),
                ElevatedButton(onPressed: testAlert, child: const Text("בדיקה"))
              ],
            ),
          ),
        ),
      ],
    ));
  }
}
