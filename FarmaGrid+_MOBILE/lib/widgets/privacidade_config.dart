import 'dart:convert';
import 'dart:typed_data';
import 'package:file_saver/file_saver.dart';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

// usa o mesmo botao nos dois perfis
class PrivacidadeConfig extends StatefulWidget {
  const PrivacidadeConfig({super.key});
  @override
  State<PrivacidadeConfig> createState() => _PrivacidadeConfigState();
}

class _PrivacidadeConfigState extends State<PrivacidadeConfig> {
  bool _baixando = false;
 
  void _avisar(String texto) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(texto)));
  }

  Future<void> _baixar() async {
    // baixa os dados da conta conectada
    setState(() => _baixando = true);
   
    try {
      final dados = await ApiService.requisitar(
        'GET',
        '/api/privacidade/exportar',
        permitirCache: false,
      );
      final arquivo = await FileSaver.instance.saveAs(
        name: 'farmagrid_meus_dados_${DateTime.now().millisecondsSinceEpoch}',
        bytes: Uint8List.fromList(
          // prepara um conversor json
          utf8.encode(const JsonEncoder.withIndent('  ').convert(dados)),
        ),
        fileExtension: 'json',
        mimeType: MimeType.custom,
        customMimeType: 'application/json',
      );
      if (arquivo != null) {
        _avisar('Download concluido.');
      }
    } catch (e) {
      _avisar('Nao foi possivel baixar os dados: $e');
    } finally {

      if (mounted) setState(() => _baixando = false);
    }
  }

  @override
  Widget build(BuildContext context) => Align(
    alignment: Alignment.centerLeft,
    child: FilledButton.icon(
      onPressed: _baixando ? null : _baixar,
      icon: const Icon(Icons.download),
      label: Text(_baixando ? 'Baixando...' : 'Baixar meus dados'),
    ),
  );
}
