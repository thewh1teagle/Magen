import 'package:flutter/material.dart';
import 'package:magen/ui/components/CustomSliverAppBar.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
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
              "הגדרות",
              style: TextStyle(fontSize: 24, color: Colors.black),
            ),
          ),
        ),
        SliverPadding(
          padding: EdgeInsets.all(20.0),
          sliver: SliverList(
            delegate: SliverChildListDelegate.fixed(
              [
                Text("הגדרת ישובים"),
                SizedBox(height: 10),
              ],
            ),
          ),
        ),
      ],
    ));
  }
}
