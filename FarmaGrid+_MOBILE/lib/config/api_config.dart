import 'package:flutter/foundation.dart';

class ApiConfig {
  static const String baseUrlEmulador = 'http://10.0.2.2:8080';
  static const String baseUrlCelularFisico = 'http://192.168.0.15:8080';
  static const String baseUrlIosSimulator = 'http://localhost:8080';
  static const String baseUrlPadraoWeb = 'http://localhost:8080';

  static String get baseUrl {
    const configurado = String.fromEnvironment('API_BASE_URL', defaultValue: '');

    if (configurado.isNotEmpty) return configurado;
    if (kIsWeb) return baseUrlPadraoWeb;
    return baseUrlEmulador;
  }
}
