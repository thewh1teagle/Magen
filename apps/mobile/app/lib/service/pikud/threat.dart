class Threat {
  String he;
  String en;

  Threat({
    required this.he,
    required this.en,
  });

  static Threat fromJSON(Map<String, dynamic> json) {
    return Threat(
      he: json['he'],
      en: json['en'],
    );
  }
}