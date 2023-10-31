import 'dart:convert';

import 'package:flutter/services.dart';

dynamic readJson(String path) async {
  var json = await rootBundle.loadString(path);
  return jsonDecode(json);
}