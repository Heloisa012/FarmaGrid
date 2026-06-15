import 'package:flutter/material.dart';

class AppThemeController extends ChangeNotifier {
  static final AppThemeController _instance = AppThemeController._();
  factory AppThemeController() => _instance;
  AppThemeController._();

  bool _darkMode = false;
  bool get darkMode => _darkMode;

  void toggleTheme() {
    _darkMode = !_darkMode;
    notifyListeners();
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
    _ctrl.addListener(() => setState(() {}));
  }

  @override
  Widget build(BuildContext context) =>
      widget.builder(_ctrl.darkMode ? ThemeMode.dark : ThemeMode.light);
}
