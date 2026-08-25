import 'package:flutter/material.dart';

class AppThemeController extends ChangeNotifier {
  static final AppThemeController _instance = AppThemeController._();
  factory AppThemeController() => _instance;
  AppThemeController._();

  bool _darkMode = false;
  bool get darkMode => _darkMode;

  void setDarkMode(bool ativo) {
    if (_darkMode == ativo) return;
    _darkMode = ativo;
    notifyListeners();
  }

  void toggleTheme() {
    setDarkMode(!_darkMode);
  }
}

class AppThemeProvider extends StatefulWidget {
  final Widget Function(ThemeMode themeMode) builder;
  const AppThemeProvider({super.key, required this.builder});

  @override
  State<AppThemeProvider> createState() => _AppThemeProviderState();
}

class _AppThemeProviderState extends State<AppThemeProvider> {
  final _ctrl = AppThemeController();

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(_atualizarTema);
  }

  void _atualizarTema() => setState(() {});

  @override
  void dispose() {
    _ctrl.removeListener(_atualizarTema);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) =>
      widget.builder(_ctrl.darkMode ? ThemeMode.dark : ThemeMode.light);
}
