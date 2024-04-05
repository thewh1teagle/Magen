import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:magen/firebase_api.dart';
import 'package:magen/pikud/cache.dart';
import 'package:magen/pikud/city.dart';
import 'package:magen/server_api.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.title});
  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Map<String, City>? cities;
  List<City> selectedCities = [];
  final searchController = TextEditingController();
  List<City>? filteredCities;
  late SharedPreferences prefs;

  Future<void> loadCities() async {
    prefs = await SharedPreferences.getInstance();
    cities = await Cities().cities;
    var citiesListString = prefs.getString("cities");
    if (citiesListString != null) {
      List<dynamic> storedCitiesDynamic = json.decode(citiesListString);
      List<City> storedCities =
          storedCitiesDynamic.map((e) => City.fromJSON(e)).toList();
      setState(() {
        selectedCities = storedCities;
      }); // Update the UI after loading cities

      print("selecte cities is $storedCities");
    }
    setState(() {});
  }

  @override
  void initState() {
    loadCities();
    super.initState();
  }

  void saveCities() async {
    var token = await FirebaseAPI().getToken();
    if (token != null) {
      ServerAPI().set(token, selectedCities.map((c) => c.id).toList());
      const snackBar = SnackBar(
        content: Text('ישובים נשמרו בהצלחה!'),
        duration: Duration(seconds: 1),
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    } else {
      const snackBar = SnackBar(
        content: Text('לא ניתן לקבל התראות!'),
        duration: Duration(seconds: 1),
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }

  @override
  Widget build(BuildContext context) {
    filteredCities = cities?.values
        .where((city) => city.he.contains(searchController.text))
        .toList();
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(5),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              const SizedBox(
                height: 10,
              ),
              const Text(
                "הגדרת ישובים להתראות",
                style: TextStyle(fontSize: 24),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextField(
                  onChanged: (value) => {setState(() {})},
                  controller: searchController,
                  decoration: const InputDecoration(
                    hintText: 'חפש ישוב',
                  ),
                ),
              ),
              const SizedBox(
                height: 10,
              ),
              SizedBox(
                height: 250,
                child: ListView.builder(
                  itemCount: filteredCities?.length,
                  itemBuilder: (context, index) {
                    var city = filteredCities?[index];
                    return ListTile(
                      shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(25),
                        topRight: Radius.circular(25),
                      )),
                      title: Text(city?.he ?? ""),
                      leading: Checkbox(
                        onChanged: (value) => {
                          setState(() {
                            if (value == true && city != null) {
                              selectedCities.add(city);
                            } else {
                              selectedCities.remove(city);
                            }
                            prefs.setString(
                                "cities", json.encode(selectedCities));
                          })
                        },
                        value: selectedCities.contains(city),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(
                height: 5,
              ),
              const Text(
                "התראות יתקבלו לישובים: ",
                style: TextStyle(fontSize: 18),
              ),
              Text(selectedCities.map((e) => e.he).join(", ")),
              ElevatedButton(onPressed: saveCities, child: const Text("שמירה")),
              const SizedBox(
                height: 20,
              ),
              const Text(
                "התראות אחרונות",
                style: TextStyle(fontSize: 24),
              ),
              const Text(
                "לא התקבלו התראות",
                style: TextStyle(color: Color.fromRGBO(0, 0, 0, 0.5)),
              )
            ],
          ),
        ),
      ),
    );
  }
}
