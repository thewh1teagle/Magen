class Threat {
  final String name;
  final String he;
  final String en;
  final int priority;

  Threat(this.name, this.he, this.en, this.priority);

  factory Threat.fromJson(Map<String, dynamic> json) {
    return Threat(
      json["name"],
      json["he"],
      json["en"],
      json["priority"],
    );
  }

  Map<String, dynamic> toJson() => {
        "name": name,
        "he": he,
        "en": en,
        "priority": priority,
      };
}
