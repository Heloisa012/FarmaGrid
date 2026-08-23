import 'package:flutter/material.dart';
import '../../services/paciente_service.dart';

class TelaExames extends StatefulWidget {
  const TelaExames({super.key});
  @override
  State<TelaExames> createState() => _TelaExamesState();
}

class _TelaExamesState extends State<TelaExames> {
  static const verde = Color(0xFF59AA53), teal = Color(0xFF7FC6BB);
  List<Map<String, dynamic>> resultados = [], solicitacoes = [];
  bool carregando = true;
  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    final dados = await Future.wait([
      PacienteService.listarExames(),
      PacienteService.listarSolicitacoesExame(),
    ]);
    if (mounted)
      setState(() {
        resultados = dados[0];
        solicitacoes = dados[1];
        carregando = false;
      });
  }

  Future<void> _solicitar() async {
    final exame = TextEditingController(),
        justificativa = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Solicitar exame'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: exame,
              decoration: const InputDecoration(labelText: 'Exame'),
            ),
            TextField(
              controller: justificativa,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Motivo ou observações',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Enviar'),
          ),
        ],
      ),
    );
    if (ok != true || exame.text.trim().isEmpty) return;
    await PacienteService.solicitarExame(
      exame.text.trim(),
      justificativa.text.trim(),
    );
    await _carregar();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8F9F5),
    appBar: AppBar(
      title: const Text('Exames'),
      backgroundColor: teal,
      foregroundColor: Colors.white,
    ),
    floatingActionButton: FloatingActionButton.extended(
      onPressed: _solicitar,
      backgroundColor: verde,
      foregroundColor: Colors.white,
      icon: const Icon(Icons.add),
      label: const Text('Solicitar exame'),
    ),
    body: carregando
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _carregar,
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(
                  'Solicitações (${solicitacoes.length})',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                if (solicitacoes.isEmpty)
                  const Card(
                    child: ListTile(
                      title: Text('Nenhuma solicitação de exame.'),
                    ),
                  )
                else
                  ...solicitacoes.map(
                    (e) => Card(
                      child: ListTile(
                        leading: const Icon(
                          Icons.assignment_outlined,
                          color: teal,
                        ),
                        title: Text('${e['exame'] ?? ''}'),
                        subtitle: Text(
                          '${e['solicitadoEm'] ?? ''}\n${e['justificativa'] ?? ''}',
                        ),
                        trailing: Chip(label: Text('${e['status'] ?? ''}')),
                      ),
                    ),
                  ),
                const SizedBox(height: 24),
                Text(
                  'Resultados (${resultados.length})',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                if (resultados.isEmpty)
                  const Card(
                    child: ListTile(
                      title: Text('Nenhum resultado disponível.'),
                    ),
                  )
                else
                  ...resultados.map(
                    (e) => Card(
                      child: ListTile(
                        leading: const Icon(Icons.picture_as_pdf, color: verde),
                        title: Text('${e['titulo'] ?? 'Exame'}'),
                        subtitle: Text(
                          '${e['tipo'] ?? ''} • ${e['data'] ?? ''}',
                        ),
                        trailing: const Icon(Icons.download_outlined),
                      ),
                    ),
                  ),
                const SizedBox(height: 80),
              ],
            ),
          ),
  );
}
