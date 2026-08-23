import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'auth_service.dart';

class ApiService {
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    if ((AuthService.usuarioLogado?.token ?? '').isNotEmpty)
      'Authorization': 'Bearer ${AuthService.usuarioLogado!.token}',
  };

  static Future<List<Map<String, dynamic>>> getList(String path) async {
    final value = await _request('GET', path);
    return (value as List? ?? const [])
        .whereType<Map>()
        .map((item) => Map<String, dynamic>.from(item))
        .toList();
  }

  static Future<Map<String, dynamic>> getMap(String path) async {
    final value = await _request('GET', path);
    return value is Map
        ? Map<String, dynamic>.from(value)
        : <String, dynamic>{};
  }

  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) => _send('POST', path, body);
  static Future<Map<String, dynamic>> put(
    String path,
    Map<String, dynamic> body,
  ) => _send('PUT', path, body);

  static Future<void> delete(String path) async {
    final response = await http.delete(
      Uri.parse('${ApiConfig.baseUrl}$path'),
      headers: headers,
    );
    _decode(response);
  }

  static Future<Map<String, dynamic>> _send(
    String method,
    String path,
    Map<String, dynamic> body,
  ) async {
    final request = http.Request(method, Uri.parse('${ApiConfig.baseUrl}$path'))
      ..headers.addAll(headers)
      ..body = jsonEncode(body);
    final response = await http.Response.fromStream(await request.send());
    final value = _decode(response);
    return value is Map
        ? Map<String, dynamic>.from(value)
        : <String, dynamic>{};
  }

  static dynamic _decode(http.Response response) {
    dynamic body;
    try {
      body = response.body.isEmpty ? null : jsonDecode(response.body);
    } catch (_) {
      body = response.body;
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        body is Map
            ? '${body['message'] ?? body['error'] ?? 'Erro HTTP ${response.statusCode}'}'
            : '${body ?? 'Erro HTTP ${response.statusCode}'}',
      );
    }
    return body;
  }

  static Future<dynamic> _request(String method, String path) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}$path'),
        headers: headers,
      );
      dynamic body;
      try {
        body = response.body.isEmpty ? null : jsonDecode(response.body);
      } catch (_) {
        body = response.body;
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ApiException(
          body is Map
              ? '${body['message'] ?? body['error'] ?? 'Erro HTTP ${response.statusCode}'}'
              : '$body',
        );
      }
      return body;
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException(
        'Não foi possível conectar à API em ${ApiConfig.baseUrl}.',
      );
    }
  }
}
