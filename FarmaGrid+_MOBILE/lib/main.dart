import 'package:farmagridd/telas/login.dart';
import 'package:farmagridd/app_theme.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return AppThemeProvider(
      builder: (themeMode) => MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'FarmaGrid+',
        themeMode: themeMode,
        theme: _criarTema(Brightness.light),
        darkTheme: _criarTema(Brightness.dark),
        home: TelaLogin(),
      ),
    );
  }

  ThemeData _criarTema(Brightness brilho) {
    final escuro = brilho == Brightness.dark;
    return ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF59AA53),
        brightness: brilho,
      ),
      useMaterial3: true,
      brightness: brilho,
      scaffoldBackgroundColor:
          escuro ? const Color(0xFF121212) : const Color(0xFFF5F5F5),
      cardColor: escuro ? const Color(0xFF1E1E1E) : Colors.white,
      dialogTheme: DialogThemeData(
        backgroundColor: escuro ? const Color(0xFF1E1E1E) : Colors.white,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: escuro ? const Color(0xFF2A2A2A) : const Color(0xFFF9F9F9),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: escuro ? const Color(0xFF1E1E1E) : Colors.white,
      ),
    );
  }
}
