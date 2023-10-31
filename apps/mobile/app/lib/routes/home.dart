import 'package:app/models/city.dart';
import 'package:app/shared.dart';
import 'package:flutter/material.dart';

class HomeRoute extends StatefulWidget {
  const HomeRoute({super.key});

  @override
  State<HomeRoute> createState() => _HomeRouteState();
}

class _HomeRouteState extends State<HomeRoute> {
  late Shared shared;
  late Future<void> sharedFuture;
  List<City> filtered = [];

  @override
  void initState() {
    super.initState();
    sharedFuture = asyncInit();
  }

  Future<void> asyncInit() async {
    shared = await Shared.getInstance();
    controller.addListener(() {
      setState(() {
        filtered = shared.cities.entries
            .where((entry) => entry.key.startsWith(controller.text))
            .map((entry) => entry.value)
            .toList();
      });
    });
  }

  final controller = TextEditingController(text: "");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Magen"),
        backgroundColor: Colors.blue,
      ),
      body: Column(
        children: [
          TextField(
            decoration: const InputDecoration(hintText: "יישוב"),
            controller: controller,
            onChanged: (value) => {controller.text = value},
          ),
          controller.text.isNotEmpty
              ? FutureBuilder<void>(
                  future: sharedFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const CircularProgressIndicator();
                    } else if (snapshot.hasError) {
                      return Text("Error: ${snapshot.error}");
                    } else {
                      return SizedBox(
                        height: 100,
                        child: SingleChildScrollView(
                          child: Column(
                            children: filtered.map((e) => Text(e.he)).toList(),
                          ),
                        ),
                      );
                    }
                  },
                )
              : const SizedBox(),
        ],
      ),
    );
  }
}
