class City {
  final int id;
  final String he;
  final String en;
  final String ru;
  final String ar;
  final String es;
  final int area;
  final int countdown;
  final double lat;
  final double lng;

  City(this.id, this.he, this.en, this.ru, this.ar, this.es, this.area,
      this.countdown, this.lat, this.lng);

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      json['id'],
      json['he'],
      json['en'],
      json['ru'],
      json['ar'],
      json['es'],
      json['area'],
      json['countdown'],
      json['lat'], // If you want to convert to double
      json['lng'], // If you want to convert to double
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "he": he,
        "en": en,
        "ru": ru,
        "ar": ar,
        "es": es,
        "area": area,
        "countdown": countdown,
        "lat": lat,
        "lng": lng,
      };
}
