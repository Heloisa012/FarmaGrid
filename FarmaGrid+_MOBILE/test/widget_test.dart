import 'package:flutter_test/flutter_test.dart';

import 'package:farmagridd/main.dart';

void main() {
  testWidgets('abre na tela de login do FarmaGrid+', (tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Bem-vindo ao\nFarmaGrid+'), findsOneWidget);
    expect(find.text('E-mail'), findsOneWidget);
    expect(find.text('Senha'), findsOneWidget);
    expect(find.text('Entrar'), findsOneWidget);
  });
}
