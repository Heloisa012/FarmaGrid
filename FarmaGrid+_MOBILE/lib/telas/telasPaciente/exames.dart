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
    final d = await Future.wait([
      PacienteService.listarExames(),
      PacienteService.listarSolicitacoesExame(),
    ]);
    if (mounted)
      setState(() {
        resultados = d[0];
        solicitacoes = d[1];
        carregando = false;
      });
  }

  Future<void> _solicitar() async {
    final exame = TextEditingController(), motivo = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Nova solicitação'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: exame,
              decoration: const InputDecoration(
                labelText: 'Nome do exame',
                prefixIcon: Icon(Icons.biotech),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: motivo,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Motivo ou observações',
                alignLabelWithHint: true,
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
    await PacienteService.solicitarExame(exame.text.trim(), motivo.text.trim());
    await _carregar();
  }

  @override
  Widget build(BuildContext context) => DefaultTabController(
    length: 2,
    child: Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        title: const Text('Central de exames'),
        backgroundColor: teal,
        foregroundColor: Colors.white,
        bottom: TabBar(
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: [
            Tab(text: 'Solicitações (${solicitacoes.length})'),
            Tab(text: 'Resultados (${resultados.length})'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _solicitar,
        backgroundColor: verde,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Nova solicitação'),
      ),
      body: carregando
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(children: [_listaSolicitacoes(), _listaResultados()]),
    ),
  );
  Widget _listaSolicitacoes() => RefreshIndicator(
    onRefresh: _carregar,
    child: solicitacoes.isEmpty
        ? _vazio(
            Icons.assignment_outlined,
            'Nenhuma solicitação',
            'Envie um pedido e acompanhe o status por aqui.',
          )
        : ListView.builder(
            padding: const EdgeInsets.all(18),
            itemCount: solicitacoes.length,
            itemBuilder: (_, i) {
              final e = solicitacoes[i];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const CircleAvatar(
                            backgroundColor: Color(0x227FC6BB),
                            child: Icon(Icons.biotech, color: teal),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              '${e['exame'] ?? ''}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Chip(label: Text('${e['status'] ?? 'Solicitado'}')),
                        ],
                      ),
                      if ('${e['justificativa'] ?? ''}'.isNotEmpty) ...[
                        const Divider(),
                        Text('${e['justificativa']}'),
                      ],
                      const SizedBox(height: 8),
                      Text(
                        'Solicitado em ${e['solicitadoEm'] ?? ''}',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
  );
  Widget _listaResultados() => RefreshIndicator(
    onRefresh: _carregar,
    child: resultados.isEmpty
        ? _vazio(
            Icons.folder_open_outlined,
            'Nenhum resultado disponível',
            'Os laudos enviados pelo laboratório aparecerão aqui.',
          )
        : ListView.builder(
            padding: const EdgeInsets.all(18),
            itemCount: resultados.length,
            itemBuilder: (_, i) {
              final e = resultados[i];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  leading: const CircleAvatar(
                    backgroundColor: Color(0x2259AA53),
                    child: Icon(Icons.picture_as_pdf, color: verde),
                  ),
                  title: Text(
                    '${e['titulo'] ?? 'Exame'}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    '${e['tipo'] ?? 'Resultado'} • ${e['data'] ?? ''}',
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: Text('${e['titulo'] ?? 'Exame'}'),
                      content: Text(
                        'Tipo: ${e['tipo'] ?? ''}\nData: ${e['data'] ?? ''}\n\nResultado armazenado no prontuário do paciente.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('Fechar'),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
  );
  Widget _vazio(IconData icon, String titulo, String texto) => ListView(
    children: [
      const SizedBox(height: 130),
      Icon(icon, size: 64, color: Colors.grey.shade400),
      const SizedBox(height: 14),
      Text(
        titulo,
        textAlign: TextAlign.center,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 6),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Text(
          texto,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.grey),
        ),
      ),
    ],
  );
}
