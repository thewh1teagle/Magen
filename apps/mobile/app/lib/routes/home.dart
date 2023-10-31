import 'package:app/models/city.dart';
import 'package:app/shared.dart';
import 'package:app/utils/api.dart';
import 'package:app/utils/local_db.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

class HomeRoute extends StatefulWidget {
  const HomeRoute({super.key});

  @override
  State<HomeRoute> createState() => _HomeRouteState();
}

class _HomeRouteState extends State<HomeRoute> {
  late Shared shared;
  late API api;
  late LocalDB db;
  late Future<void> sharedFuture;
  List<City> filtered = [];
  List<City> selected = [];
  final controller = SearchController();

  void firebaseListener() async {
    FirebaseMessaging.onMessage.listen((event) {
      print("Got firebase message $event");
    });
  }

  @override
  void initState() {
    super.initState();
    controller.addListener(() {
      filterCities(controller.text);
    });
    sharedFuture = asyncInit();
  }

  void filterCities(String value) {
    setState(() {
      filtered = shared.cities.entries
          .where((entry) => value.isEmpty || entry.key.startsWith(value))
          .map((entry) => entry.value)
          .toList();
    });
  }

  Future<void> asyncInit() async {
    db = await LocalDB.getInstance();
    shared = await Shared.getInstance();
    api = await API.getInstance();
    selected = await db.getCities();
    setState(() {
      filtered = shared.cities.values.toList();
      selected;  
    });
    // controller.addListener(() {
    //   filterCities(controller.text);
    // });
  }

  // final controller = TextEditingController(text: "");

  Future<void> onSave() async {
  
    print("selected ${selected}");
    await db.setCities(selected);
    var newCities = await db.getCities();
    print("newCities: ${newCities}");
    print("Token: ${await db.getToken()}");
    var token = await api.register(selected);
    db.setToken(token);
    
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Magen"),
        backgroundColor: Colors.blue,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: SearchAnchor(
                searchController: controller,
                builder: (BuildContext context, SearchController controller) {
                  return SearchBar(
                    hintText: "יישוב",
                    controller: controller,
                    padding: const MaterialStatePropertyAll<EdgeInsets>(
                        EdgeInsets.symmetric(horizontal: 16.0)),
                    onTap: () {
                      controller.openView();
                    },
                    onChanged: (String newValue) {
                      print("changed!!!");
                      controller.openView();
                      filterCities(newValue);
                    },
                    leading: const Icon(Icons.search),
                    trailing: const <Widget>[],
                  );
                },
                suggestionsBuilder:
                    (BuildContext context, SearchController controller) {
                  return filtered.map((f) {
                    return ListTile(
                      title: Text(f.he),
                      onTap: () {
                        setState(() {
                          selected.add(f);
                        });
                        controller.closeView("");
                      },
                    );
                  }).toList();
                }),
          ),
          Wrap(
            spacing: 5,
            children: selected
                .map((item) => Chip(
                      deleteIcon: Icon(Icons.close),
                      onDeleted: () {
                        setState(() {
                          selected = selected
                              .where((element) => element.id != item.id)
                              .toList();
                        });
                      },
                      label: Text(item.he),
                    ))
                .toList(),
          ),
          const SizedBox(
            height: 5,
          ),
          ElevatedButton(
            onPressed: onSave,
            style: const ButtonStyle(),
            child: const Text("שמירה"),
          )
        ],
      ),
    );
  }
}
