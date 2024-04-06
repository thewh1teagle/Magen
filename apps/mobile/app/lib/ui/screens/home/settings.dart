import 'package:flutter/material.dart';
import 'package:magen/service/pikud/cache.dart';
import 'package:magen/service/pikud/city.dart';
import 'package:magen/ui/components/CustomSliverAppBar.dart';
import 'package:shared_preferences/shared_preferences.dart';

String prefsActiveCitiesKey = "activeCities";

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  List<String> activeCities = [];
  Map<String, City> cities = {};

  Future loadPrefs() async {
    var prefs = await SharedPreferences.getInstance();
    var storedIDS = prefs.getStringList(prefsActiveCitiesKey);
    if (storedIDS != null) {
      setState(() {
        activeCities = storedIDS;
      });
    }
  }

  Future loadCities() async {
    cities = await Cities().cities;
    setState(() {
      cities = cities;
    });
    // print("cities $cities");
  }

  Future pushCity(String id) async {
    var prefs = await SharedPreferences.getInstance();
    activeCities.add(id);
    prefs.setStringList(prefsActiveCitiesKey, activeCities);
    setState(() {
      activeCities = activeCities;
    });
    print("activeCities: $activeCities");
  }

  Future removeCity(String id) async {
    var prefs = await SharedPreferences.getInstance();
    activeCities.remove(id);
    prefs.setStringList(prefsActiveCitiesKey, activeCities);
    setState(() {
      activeCities = activeCities;
    });
  }

  @override
  void initState() {
    loadPrefs();
    loadCities();
    super.initState();
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
                "הגדרות",
                style: TextStyle(fontSize: 24, color: Colors.black),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20.0),
            sliver: SliverList(
              delegate: SliverChildListDelegate.fixed(
                [
                  const Text("הגדרת ישובים"),
                  const SizedBox(height: 10),
                  SearchAnchor(builder:
                      (BuildContext context, SearchController controller) {
                    return SearchBar(
                      hintText: "חפש יישוב",
                      controller: controller,
                      padding: const MaterialStatePropertyAll<EdgeInsets>(
                          EdgeInsets.symmetric(horizontal: 16.0)),
                      onTap: () {
                        controller.openView();
                      },
                      onChanged: (_) {
                        controller.openView();
                      },
                      leading: const Icon(Icons.search),
                      trailing: const <Widget>[],
                    );
                  }, suggestionsBuilder: (BuildContext context,
                      SearchController searchController) {
                    return cities.entries.map((e) {
                      return ListTile(
                        title: Text(e.value.he),
                        onTap: () {
                          pushCity(e.key);
                          setState(() {
                            FocusScope.of(context).unfocus();
                            searchController.closeView("");
                          });
                        },
                      );
                    });
                  }),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: SizedBox(
                height: 200,
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 3,
                    children: activeCities
                        .map((name) => Chip(
                              label: Text(cities[name]?.he ?? "לא ידוע"),
                              onDeleted: () {
                                removeCity(name);
                              },
                            ))
                        .toList(),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CustomActionChip extends StatelessWidget {
  final Widget label;
  final VoidCallback onPressed;

  const CustomActionChip(
      {super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      label: label,
      onPressed: onPressed,
      // You can customize other properties of ActionChip here if needed
    );
  }
}
