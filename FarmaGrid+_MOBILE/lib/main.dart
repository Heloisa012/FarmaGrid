import 'package:farmagridd/telas/login.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FarmaGrid+',
      theme: _criarTema(),
      home: TelaLogin(),
    );
  }

  ThemeData _criarTema() {
    return ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF59AA53),
        brightness: Brightness.light,
      ),
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      cardColor: Colors.white,
      dialogTheme: const DialogThemeData(backgroundColor: Colors.white),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true,
        fillColor: Color(0xFFF9F9F9),
      ),
      navigationBarTheme: const NavigationBarThemeData(
        backgroundColor: Colors.white,
      ),
    );
  }
}
