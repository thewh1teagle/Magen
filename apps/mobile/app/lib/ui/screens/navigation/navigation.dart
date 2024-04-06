import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:magen/provider/navigation_provider.dart';
import 'package:magen/ui/screens/home/home.dart';
import 'package:magen/ui/screens/home/settings.dart';
import 'package:provider/provider.dart';

class NavigationScreen extends StatefulWidget {
  const NavigationScreen({super.key});

  @override
  State<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends State<NavigationScreen> {
  @override
  Widget build(BuildContext context) {
    int index = Provider.of<NavigationIndexProvider>(context).index;
    return PopScope(
      canPop: true,
      onPopInvoked: (bool didPop) {
        if (!didPop) {
          Provider.of<NavigationIndexProvider>(context, listen: false)
              .setIndex(0);
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
            Provider.of<NavigationIndexProvider>(context, listen: false)
                .setIndex(newIndex);
          },
          selectedIndex: index,
          destinations: <Widget>[
            NavigationDestination(
              icon: index == 0
                  ? const Icon(Icons.notifications)
                  : const Icon(Icons.notifications_outlined),
              label: "התראות",
              tooltip: '',
            ),
            NavigationDestination(
              icon: index == 1
                  ? const Icon(Icons.settings)
                  : const Icon(Icons.settings_outlined),
              label: "הגדרות",
              tooltip: '',
            ),
          ],
        ),
      ),
    );
  }
}
