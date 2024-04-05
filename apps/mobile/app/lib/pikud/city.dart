class City {
  String id;
  String he;
  String? en;
  String? ru;
  String? ar;
  String? es;
  int? area;
  int? countdown;
  double? lat;
  double? lng;

  City({
    required this.id,
    required this.he,
    this.en,
    this.ru,
    this.ar,
    this.es,
    this.area,
    this.countdown,
    this.lat,
    this.lng,
  });

  static City fromJSON(Map<String, dynamic> json) {
    return City(
      id: json['id'].toString(),
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
