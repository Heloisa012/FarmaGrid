import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:farmagrid/models/usuario_logado.dart';
import 'package:farmagrid/services/api_service.dart';
import 'package:farmagrid/services/auth_service.dart';
import 'package:farmagrid/services/offline_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() {
    FlutterSecureStorage.setMockInitialValues({});
    OfflineService.aviso.value = null;
    AuthService.usuarioLogado = UsuarioLogado(
      token: 'teste',
      id: 1,
      email: 'teste@email.com',
      tipo: 3,
      perfil: 'paciente',
      idPaciente: 10,
    );
  });
  tearDown(() {
    AuthService.usuarioLogado = null;
  });

  test('usa a copia quando a rede falha e avisa o usuario', () async {
    await OfflineService.salvar(1, '/api/teste', {'nome': 'teste'});
    final dados = await http.runWithClient(
      () => ApiService.getMap('/api/teste'),
      () => MockClient((_) async => throw http.ClientException('sem rede')),
    );
    expect(dados['nome'], 'teste');
    expect(OfflineService.aviso.value, contains('Sem conexao'));
  });

  test('nao usa copia de outra conta', () async {
    await OfflineService.salvar(2, '/api/teste', {'nome': 'outra conta'});
    await expectLater(
      http.runWithClient(
        () => ApiService.getMap('/api/teste'),
        () => MockClient((_) async => throw http.ClientException('sem rede')),
      ),
      throwsA(isA<ApiException>()),
    );
  });

  test('nao usa copia quando a api nega acesso', () async {
    await OfflineService.salvar(1, '/api/teste', {'nome': 'teste'});
    await expectLater(
      http.runWithClient(
        () => ApiService.getMap('/api/teste'),
        () => MockClient((_) async => http.Response('{}', 403)),
      ),
      throwsA(isA<ApiException>()),
    );
    expect(OfflineService.aviso.value, isNull);
  });

  test('exportacao nao usa cache', () async {
    await OfflineService.salvar(1, '/api/privacidade/exportar', {
      'nome': 'teste',
    });
    await expectLater(
      http.runWithClient(
        () => ApiService.requisitar(
          'GET',
          '/api/privacidade/exportar',
          permitirCache: false,
        ),
        () => MockClient((_) async => throw http.ClientException('sem rede')),
      ),
      throwsA(isA<ApiException>()),
    );
  });

  test('copia com mais de um dia expira', () async {
    FlutterSecureStorage.setMockInitialValues({
      OfflineService.chave(1, '/api/teste'): jsonEncode({
        'data': DateTime.now()
            .subtract(const Duration(hours: 25))
            .toIso8601String(),
        'dados': {'nome': 'teste'},
      }),
    });
    expect(await OfflineService.ler(1, '/api/teste'), isNull);
  });

  test('limpar remove apenas as copias da conta atual', () async {
    await OfflineService.salvar(1, '/api/teste', {'id': 1});
    await OfflineService.salvar(2, '/api/teste', {'id': 2});
    await OfflineService.limpar(1);
    expect(await OfflineService.ler(1, '/api/teste'), isNull);
    expect(await OfflineService.ler(2, '/api/teste'), {'id': 2});
  });

  test('alteracao sem rede falha sem confirmar salvamento', () async {
    await expectLater(
      http.runWithClient(
        () => ApiService.put('/api/teste', {'nome': 'novo'}),
        () => MockClient((_) async => throw http.ClientException('sem rede')),
      ),
      throwsA(
        isA<ApiException>().having(
          (e) => e.mensagem,
          'mensagem',
          contains('nao foi salva'),
        ),
      ),
    );
  });
}
