import 'package:flutter/foundation.dart';

/// Mantém compatibilidade com as telas antigas, agora fixadas no tema claro.
class AppThemeController extends ChangeNotifier {
  static final AppThemeController _instance = AppThemeController._();
  factory AppThemeController() => _instance;
  AppThemeController._();

  bool get darkMode => false;
}
