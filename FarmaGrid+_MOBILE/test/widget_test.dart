import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:farmagridd/app_theme.dart';
import 'package:farmagridd/main.dart';

void main() {
  setUp(() => AppThemeController().setDarkMode(false));

  testWidgets('abre na tela de login do FarmaGrid+', (tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Bem-vindo ao\nFarmaGrid+'), findsOneWidget);
    expect(find.text('E-mail'), findsOneWidget);
    expect(find.text('Senha'), findsOneWidget);
    expect(find.text('Entrar'), findsOneWidget);
  });

  testWidgets('alterna entre os temas claro e escuro', (tester) async {
    await tester.pumpWidget(
      AppThemeProvider(
        builder: (modo) => MaterialApp(
          theme: ThemeData.light(),
          darkTheme: ThemeData.dark(),
          themeMode: modo,
          home: const Scaffold(body: Text('Conteúdo')),
        ),
      ),
    );

    MaterialApp app = tester.widget(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.light);

    AppThemeController().toggleTheme();
    await tester.pump();

    app = tester.widget(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.dark);
  });
}
