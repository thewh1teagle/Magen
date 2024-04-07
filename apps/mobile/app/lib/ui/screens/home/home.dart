import 'package:flutter/material.dart';
import 'package:magen/service/firebase/firebase_api.dart';
import 'package:magen/service/server_api.dart';
import 'package:magen/ui/components/CustomSliverAppBar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
  }

  Future testAlert() async {
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
