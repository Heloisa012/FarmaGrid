import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';
import '../models/usuario_logado.dart';

class ApiException implements Exception {
  final String mensagem;
  ApiException(this.mensagem);

  @override
  String toString() => mensagem;
}

class AuthService {
  static const _storage = FlutterSecureStorage();
  static const _chaveToken = 'token_jwt';

  static Future<UsuarioLogado> login(String email, String senha) async {
    final resposta = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'senha': senha}),
    );

    if (resposta.statusCode != 200) {
      throw ApiException(_extrairMensagemErro(resposta));
    }

    final corpo = jsonDecode(resposta.body);
    final token = corpo['token'] as String;

    await _storage.write(key: _chaveToken, value: token);

    final me = await _buscarMe(token);
    usuarioLogado = UsuarioLogado.fromLoginEMe(token: token, me: me);
    return usuarioLogado!;
  }

  static Future<UsuarioLogado> cadastro(Map<String, dynamic> dadosCadastro) async {
    final resposta = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/auth/cadastro'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(dadosCadastro),
    );

    if (resposta.statusCode != 201) {
      throw ApiException(_extrairMensagemErro(resposta));
    }

    final corpo = jsonDecode(resposta.body);
    final token = corpo['token'] as String;

    await _storage.write(key: _chaveToken, value: token);

    final me = await _buscarMe(token);
    usuarioLogado = UsuarioLogado.fromLoginEMe(token: token, me: me);
    return usuarioLogado!;
  }

  static Future<Map<String, dynamic>> _buscarMe(String token) async {
    final resposta = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/auth/me'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (resposta.statusCode != 200) {
      throw ApiException(_extrairMensagemErro(resposta));
    }

    return jsonDecode(resposta.body) as Map<String, dynamic>;
  }

  static Future<bool> restaurarSessao() async {
    final token = await _storage.read(key: _chaveToken);
    if (token == null) return false;

    try {
      final me = await _buscarMe(token);
      usuarioLogado = UsuarioLogado.fromLoginEMe(token: token, me: me);
      return true;
    } catch (_) {
      await _storage.delete(key: _chaveToken);
      return false;
    }
  }

  static Future<void> logout() async {
    await _storage.delete(key: _chaveToken);
    usuarioLogado = null;
  }

  static String _extrairMensagemErro(http.Response resposta) {
    try {
      final corpo = jsonDecode(resposta.body);
      if (corpo is Map && corpo['message'] != null) {
        return corpo['message'].toString();
      }
      return corpo.toString();
    } catch (_) {
      return resposta.body.isNotEmpty
          ? resposta.body
          : 'Erro inesperado ao conectar com o servidor.';
    }
  }
}