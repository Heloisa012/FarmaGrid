import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

// guarda uma copia por conta por ate um dia
class OfflineService {
  static const storage = FlutterSecureStorage();
  static final aviso = ValueNotifier<String?>(null);
  static String prefixo(int id) =>
      'offline_${Uri.encodeComponent(ApiConfig.baseUrl)}_${id}_';
  static String chave(int id, String path) =>
      '${prefixo(id)}${Uri.encodeComponent(path)}';

  static Future<void> salvar(int id, String path, dynamic dados) async {
    try {
      final valor = jsonEncode({
        'data': DateTime.now().toUtc().toIso8601String(),
        'dados': dados,
      });
      // evita guardar respostas grandes no aparelho
      if (utf8.encode(valor).length > 200000) return;
      await storage.write(key: chave(id, path), value: valor);
    } catch (_) {
      // uma falha no cache nao impede a consulta online
    }
  }

  static Future<dynamic> ler(int id, String path) async {
    try {
      final valor = await storage.read(key: chave(id, path));
      if (valor == null) return null;
      final json = jsonDecode(valor) as Map<String, dynamic>;
      final data = DateTime.parse(json['data'] as String);
      if (DateTime.now().toUtc().difference(data) > const Duration(hours: 24)) {
        await storage.delete(key: chave(id, path));
        return null;
      }
      aviso.value =
          'Sem conexao: dados salvos em ${data.toLocal().toString().substring(0, 16)}. Podem estar desatualizados.';
      return json['dados'];
    } catch (_) {
      return null;
    }
  }

  static Future<void> limpar(int id) async {
    final valores = await storage.readAll();
    for (final key in valores.keys.toList().where(
      (key) => key.startsWith(prefixo(id)),
    )) {
      await storage.delete(key: key);
    }
    aviso.value = null;
  }
}
