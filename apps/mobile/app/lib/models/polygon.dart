class Polygon {
  List<List<double>> data;
  Polygon({required this.data});

  factory Polygon.fromJson(dynamic value) {
     List<List<double>> parsed = (value as List)
          .map((innerList) => (innerList as List)
              .map((value) => (value as num).toDouble())
              .toList())
          .toList();
      return Polygon(data: parsed);
  }
}