import 'package:flutter/foundation.dart';

class NavigationIndexProvider with ChangeNotifier {
  int _index = 0;

  int get index => _index;

  void setIndex(int newIndex) {
    _index = newIndex;
    notifyListeners();
  }
}
