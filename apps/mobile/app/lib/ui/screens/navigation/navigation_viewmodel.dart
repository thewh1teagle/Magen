import 'package:flutter/material.dart';
import 'package:magen/ui/screens/home/home.dart';

Widget getViewForIndex(int index) {
  switch (index) {
    case 0:
      return const HomeScreen();
    case 1:
      return const HomeScreen();
    case 2:
      return const HomeScreen();
    default:
      return const HomeScreen();
  }
}
