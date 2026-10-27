import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:farmagrid/models/usuario_logado.dart';
import 'package:farmagrid/services/auth_service.dart';
import 'package:farmagrid/services/paciente_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() {
    FlutterSecureStorage.setMockInitialValues({});
    AuthService.usuarioLogado = UsuarioLogado(
      token: 'teste', id: 1, email: 'teste@example.com', tipo: 3,
      perfil: 'paciente', idPaciente: 10,
    );
  });
  tearDown(() => AuthService.usuarioLogado = null);

  test('carrega catalogo sem exigir farmacia na sessao do paciente', () async {
    final produtos = await http.runWithClient(
      PacienteService.listarProdutos,
      () => MockClient((request) async {
        expect(request.url.path, '/api/produtos/disponiveis');
        expect(request.url.queryParameters, isEmpty);
        return http.Response(jsonEncode([
          {'id': 1, 'nome': 'Medicamento', 'preco': 12.5, 'quantidade': 4},
        ]), 200);
      }),
    );
    expect(produtos.single.nome, 'Medicamento');
    expect(produtos.single.quantidade, 4);
  });

  test('carrega descontos do paciente e preserva os resgatados', () async {
    final cupons = await http.runWithClient(
      PacienteService.listarCupons,
      () => MockClient((request) async {
        expect(request.url.path, '/api/pacientes/10/cupons');
        return http.Response(jsonEncode([
          {'id': 1, 'codigo': 'PROMO', 'resgatado': true},
          {'id': 2, 'codigo': 'NOVO', 'resgatado': false},
        ]), 200);
      }),
    );
    expect(cupons.first.resgatado, isTrue);
    expect(cupons.last.resgatado, isFalse);
  });
}
