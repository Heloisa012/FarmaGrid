import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:farmagridd/main.dart';
import 'package:farmagridd/services/auth_service.dart';

void main() {
  testWidgets('abre na tela de login do FarmaGrid+', (tester) async {
    await tester.pumpWidget(MyApp(restaurarSessao: () async => false));
    await tester.pumpAndSettle();

    expect(find.text('Bem-vindo ao\nFarmaGrid+'), findsOneWidget);
    expect(find.text('E-mail'), findsOneWidget);
    expect(find.text('Senha'), findsOneWidget);
    expect(find.text('Entrar'), findsOneWidget);
  });

  testWidgets('exibe carregamento enquanto restaura a sessão', (tester) async {
    await tester.pumpWidget(
      MyApp(
        restaurarSessao: () =>
            Future<bool>.delayed(const Duration(seconds: 1), () => false),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    await tester.pumpAndSettle();
    expect(find.text('Entrar'), findsOneWidget);
  });

  tearDown(() {
    AuthService.usuarioLogado = null;
  });
}
