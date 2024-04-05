class Area {
  String he;

  Area({
    required this.he,
  });

  static Area fromJSON(Map<String, dynamic> json) {
    return Area(
      he: json['he'],
    );
  }
}