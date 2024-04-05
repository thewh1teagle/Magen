class City {
  String id;
  String he;
  String en;
  String ru;
  String ar;
  String es;
  int area;
  int countdown;
  double lat;
  double lng;

  City({
    required this.id,
    required this.he,
    required this.en,
    required this.ru,
    required this.ar,
    required this.es,
    required this.area,
    required this.countdown,
    required this.lat,
    required this.lng,
  });

  static City fromJSON(Map<String, dynamic> json) {
    return City(
      id: json['id'],
      he: json['he'],
      en: json['en'],
      ru: json['ru'],
      ar: json['ar'],
      es: json['es'],
      area: json['area'],
      countdown: json['countdown'],
      lat: json['lat'].toDouble(),
      lng: json['lng'].toDouble(),
    );
  }
}