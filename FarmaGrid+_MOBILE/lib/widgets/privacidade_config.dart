import 'dart:convert';
import 'dart:typed_data';
import 'package:file_saver/file_saver.dart';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/offline_service.dart';

// usa o mesmo bloco de privacidade nos dois perfis
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
    // avisa antes de salvar dados de saude fora do app
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Baixar meus dados'),
        content: const Text(
          'O arquivo JSON pode conter dados pessoais e de saude. Guarde em um local seguro e evite compartilhar. Deseja continuar?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Baixar'),
          ),
        ],
      ),
    );
    if (confirmar != true || !mounted) return;
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
          utf8.encode(const JsonEncoder.withIndent('  ').convert(dados)),
        ),
        fileExtension: 'json',
        mimeType: MimeType.custom,
        customMimeType: 'application/json',
      );
      if (arquivo != null)
        _avisar('Download concluido. Guarde seu arquivo em local seguro.');
    } catch (e) {
      _avisar('Nao foi possivel baixar os dados: $e');
    } finally {
      if (mounted) setState(() => _baixando = false);
    }
  }

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Privacidade e meus dados',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 10),
          const Text(
            'Seus dados sao usados para cadastro, atendimento e recursos de saude. Voce pode corrigir seu perfil nas configuracoes e baixar uma copia abaixo. A exportacao exige conexao com a API.',
          ),
          const SizedBox(height: 10),
          FilledButton.icon(
            onPressed: _baixando ? null : _baixar,
            icon: const Icon(Icons.download),
            label: Text(_baixando ? 'Baixando...' : 'Baixar meus dados'),
          ),
          const SizedBox(height: 10),
          const Text(
            'Consultas ja carregadas ficam protegidas no aparelho por ate 24 horas para uso offline. Senhas e cartoes nao entram nessa copia. Alteracoes precisam de conexao. Ao sair da conta, as copias locais sao apagadas.',
          ),
          TextButton.icon(
            icon: const Icon(Icons.delete_outline),
            label: const Text('Apagar dados offline deste aparelho'),
            onPressed: () async {
              try {
                final id = AuthService.usuarioLogado?.id;
                if (id != null) await OfflineService.limpar(id);
                _avisar(
                  'Dados offline apagados. Novas consultas online criam novas copias.',
                );
              } catch (_) {
                _avisar(
                  'Nao foi possivel apagar os dados offline. Tente novamente.',
                );
              }
            },
          ),
          const Text(
            'Correcao, informacoes sobre compartilhamento, revogacao e exclusao podem ser solicitadas ao responsavel pelo servico. Dados sujeitos a obrigacao legal podem precisar ser mantidos. O canal de privacidade ainda precisa ser definido pelo responsavel antes da publicacao.',
          ),
        ],
      ),
    ),
  );
}
