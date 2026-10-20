import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:farmagrid/services/auth_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() {
    FlutterSecureStorage.setMockInitialValues({});
    AuthService.usuarioLogado = null;
  });
  tearDown(() {
    AuthService.usuarioLogado = null;
  });

  test('login guarda a sessao e tira espacos do email', () async {
    final usuario = await http.runWithClient(
      () => AuthService.login(' pessoa@example.com ', 'senha', 3),
      () => MockClient((request) async {
        expect(jsonDecode(request.body)['email'], 'pessoa@example.com');
        return http.Response(
          jsonEncode({'token': 'teste', 'id': 1, 'tipo': 3, 'idPaciente': 2}),
          200,
        );
      }),
    );
    expect(AuthService.usuarioLogado, same(usuario));
    expect(await AuthService.restaurarSessao(), isTrue);
  });

  test('erro de credenciais continua sendo mostrado', () async {
    await expectLater(
      http.runWithClient(
        () => AuthService.login('pessoa@example.com', 'senha', 3),
        () => MockClient(
          (_) async => http.Response('Email ou senha incorretos.', 401),
        ),
      ),
      throwsA(
        isA<ApiException>().having(
          (e) => e.mensagem,
          'mensagem',
          contains('Email ou senha incorretos'),
        ),
      ),
    );
  });

  test('erro de rede informa falha de acesso', () async {
    await expectLater(
      http.runWithClient(
        () => AuthService.login('pessoa@example.com', 'senha', 3),
        () => MockClient((_) async => throw http.ClientException('sem rede')),
      ),
      throwsA(
        isA<ApiException>().having(
          (e) => e.mensagem,
          'mensagem',
          contains('acessar a API'),
        ),
      ),
    );
  });

  test('resposta invalida nao vira erro de conexao', () async {
    await expectLater(
      http.runWithClient(
        () => AuthService.login('pessoa@example.com', 'senha', 3),
        () => MockClient((_) async => http.Response('{}', 200)),
      ),
      throwsA(
        isA<ApiException>().having(
          (e) => e.mensagem,
          'mensagem',
          contains('resposta de login invalida'),
        ),
      ),
    );
    expect(AuthService.usuarioLogado, isNull);
  });
}
