import 'package:flutter/material.dart';
import 'package:magen/ui/components/CustomSliverAppBar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
        body: CustomScrollView(
      slivers: [
        CustomSliverAppBar(
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
          padding: EdgeInsets.all(20.0),
          sliver: SliverList(
            delegate: SliverChildListDelegate.fixed(
              [
                Text("לא התקבלו התראות חדשות"),
                SizedBox(height: 10),
              ],
            ),
          ),
        ),
      ],
    ));
  }
}
