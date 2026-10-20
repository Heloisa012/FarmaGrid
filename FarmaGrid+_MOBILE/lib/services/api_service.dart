import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../widgets/carregamento.dart';
import 'auth_service.dart';
import 'offline_service.dart';

// chamadas da api juntas pra reaproveitar o mesmo envio e tratamento de resposta
class ApiService {
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    if ((AuthService.usuarioLogado?.token ?? '').isNotEmpty)
      'Authorization': 'Bearer ${AuthService.usuarioLogado!.token}',
  };

  static Future<List<Map<String, dynamic>>> getList(String path) async {
    final value = await requisitar('GET', path);
    if (value is! List || value.any((item) => item is! Map)) {
      throw ApiException(
        'O servidor retornou uma lista inválida. Tente novamente.',
      );
    }
    return List<Map<String, dynamic>>.from(
      value.map((item) => Map<String, dynamic>.from(item as Map)),
    );
  }

  static Future<Map<String, dynamic>> getMap(String path) async =>
      _map(await requisitar('GET', path));

  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async => _map(await requisitar('POST', path, body: body));
  static Future<Map<String, dynamic>> put(
    String path,
    Map<String, dynamic> body,
  ) async => _map(await requisitar('PUT', path, body: body));
  static Future<void> delete(String path) async {
    await requisitar('DELETE', path);
  }

  static Map<String, dynamic> _map(dynamic value) =>
      value is Map ? Map<String, dynamic>.from(value) : <String, dynamic>{};

  static String _mensagem(String method, String path) {
    if (method == 'GET') {
      return path.contains('farmacias-proximas')
          ? 'Buscando farmácias...'
          : 'Carregando...';
    }
    if (path == '/auth/recuperacao/solicitar') return 'Enviando código...';
    if (path == '/auth/recuperacao/validar-codigo')
      return 'Validando código...';
    if (path == '/auth/recuperacao/redefinir') return 'Redefinindo senha...';
    if (method == 'DELETE') return 'Removendo...';
    if (path.contains('resgatar')) return 'Resgatando cupom...';
    if (path.contains('/senha')) return 'Atualizando senha...';
    if (path.contains('/foto')) return 'Atualizando foto...';
    if (path.contains('/assinatura')) return 'Atualizando plano...';
    if (path.contains('/teleconsultas')) return 'Agendando consulta...';
    if (path.contains('/solicitacoes-exame')) return 'Enviando solicitação...';
    if (path.contains('/receitas')) return 'Gerando receita...';
    return 'Salvando...';
  }

  // monta a requisicao, converte o json e mostra uma mensagem amigavel se der erro ou demorar
  static Future<dynamic> requisitar(
    String method,
    String path, {
    Map<String, dynamic>? body,
    bool permitirCache = true,
  }) => Carregamento.executar(_mensagem(method, path), () async {
    final client = http.Client();
    final usuario = AuthService.usuarioLogado;
    // exportacao e pagamentos sempre precisam do servidor
    final usarCache =
        permitirCache &&
        method == 'GET' &&
        usuario != null &&
        !path.contains('cartoes') &&
        !path.contains('assinatura') &&
        !path.contains('exportar') &&
        !path.contains('/logins');
    Future<dynamic> tentarOffline() async {
      if (usarCache && AuthService.usuarioLogado?.id == usuario.id) {
        final salvo = await OfflineService.ler(usuario.id, path);
        if (salvo != null) return salvo;
      }
      throw ApiException(
        method == 'GET'
            ? 'Sem conexao com a API e sem dados salvos disponiveis.'
            : 'Sem conexao com a API. A alteracao nao foi salva. Tente novamente quando a conexao voltar.',
      );
    }

    try {
      final request = http.Request(
        method,
        Uri.parse('${ApiConfig.baseUrl}$path'),
      )..headers.addAll(headers);
      if (body != null) request.body = jsonEncode(body);
      final response = await client
          .send(request)
          .then(http.Response.fromStream)
          .timeout(
            Duration(seconds: path.contains('farmacias-proximas') ? 100 : 30),
          );
      final texto = utf8.decode(response.bodyBytes);
      dynamic value;
      try {
        value = texto.isEmpty ? null : jsonDecode(texto);
      } on FormatException {
        value = texto;
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ApiException(
          value is Map
              ? '${value['message'] ?? value['mensagem'] ?? value['error'] ?? 'Erro HTTP ${response.statusCode}'}'
              : '${value ?? 'Erro HTTP ${response.statusCode}'}',
        );
      }
      if (AuthService.usuarioLogado?.id != usuario?.id) {
        throw ApiException('A sessao mudou. Faca login novamente.');
      }
      if (usarCache) await OfflineService.salvar(usuario.id, path, value);
      if (method != 'GET' && usuario != null) {
        // apaga copias antigas depois de mudar os dados
        try {
          await OfflineService.limpar(usuario.id);
        } catch (_) {}
      }
      return value;
    } on ApiException {
      rethrow;
    } on TimeoutException {
      return tentarOffline();
    } on http.ClientException {
      return tentarOffline();
    } catch (_) {
      throw ApiException(
        'Nao foi possivel concluir a requisicao. Tente novamente.',
      );
    } finally {
      client.close();
    }
  });
}
