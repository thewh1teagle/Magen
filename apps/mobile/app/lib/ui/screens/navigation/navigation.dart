import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:magen/ui/screens/home/home.dart';
import 'package:magen/ui/screens/home/settings.dart';

class NavigationScreen extends StatefulWidget {
  const NavigationScreen({super.key});

  @override
  State<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends State<NavigationScreen> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: true,
      onPopInvoked: (bool didPop) {
        if (!didPop) {
          setState(() {
            index = 0;
          });
        }
      },
      child: Scaffold(
        body: PageTransitionSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (
            Widget child,
            Animation<double> animation,
            Animation<double> secondaryAnimation,
          ) {
            return FadeThroughTransition(
              animation: animation,
              secondaryAnimation: secondaryAnimation,
              fillColor: Theme.of(context).colorScheme.surface,
              child: child,
            );
          },
          child: index == 0 ? const HomeScreen() : const SettingsScreen(),
        ),
        bottomNavigationBar: NavigationBar(
          onDestinationSelected: (int newIndex) {
            print("new destination is $newIndex");
            setState(() {
              index = newIndex;
            });
          },
          selectedIndex: index,
          destinations: const <Widget>[
            NavigationDestination(
              icon: true
                  ? Icon(Icons.notifications)
                  : Icon(Icons.dashboard_outlined),
              label: "התראות",
              tooltip: '',
            ),
            NavigationDestination(
              icon: true ? Icon(Icons.settings) : Icon(Icons.settings_outlined),
              label: "הגדרות",
              tooltip: '',
            ),
          ],
        ),
      ),
    );
  }
}
