import 'package:flutter/material.dart';
import '../../services/paciente_service.dart';

class Teleconsultas extends StatefulWidget {
  const Teleconsultas({super.key});
  @override
  State<Teleconsultas> createState() => _TeleconsultasState();
}

class _TeleconsultasState extends State<Teleconsultas> {
  static const verde = Color(0xFF59AA53);
  List<Map<String, dynamic>> consultas = [], medicos = [];
  bool carregando = true;
  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    final dados = await Future.wait([
      PacienteService.listarConsultas(),
      PacienteService.listarMedicos(),
    ]);
    if (!mounted) return;
    setState(() {
      consultas = (dados[0] as List)
          .map(
            (c) => <String, dynamic>{
              'id': c.id,
              'idMedico': c.idMedico,
              'data': c.data,
              'horario': c.horario,
              'status': c.status,
            },
          )
          .toList();
      medicos = dados[1] as List<Map<String, dynamic>>;
      carregando = false;
    });
  }

  String _nomeMedico(dynamic id) {
    final m = medicos.cast<Map<String, dynamic>?>().firstWhere(
      (m) => '${m?['id']}' == '$id',
      orElse: () => null,
    );
    return m == null
        ? 'Médico'
        : 'Dr(a). ${m['nome'] ?? ''} ${m['sobrenome'] ?? ''}';
  }

  Future<void> _agendar() async {
    if (medicos.isEmpty) return;
    Map<String, dynamic>? medico = medicos.first;
    DateTime data = DateTime.now().add(const Duration(days: 1));
    String hora = '09:00';
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) => AlertDialog(
          title: const Text('Agendar teleconsulta'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<Map<String, dynamic>>(
                initialValue: medico,
                decoration: const InputDecoration(labelText: 'Médico'),
                items: medicos
                    .map(
                      (m) => DropdownMenuItem(
                        value: m,
                        child: Text(
                          '${m['nome']} • ${m['especialidade'] ?? ''}',
                        ),
                      ),
                    )
                    .toList(),
                onChanged: (v) => setLocal(() => medico = v),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Data'),
                subtitle: Text('${data.day}/${data.month}/${data.year}'),
                trailing: const Icon(Icons.calendar_month),
                onTap: () async {
                  final d = await showDatePicker(
                    context: ctx,
                    initialDate: data,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 180)),
                  );
                  if (d != null) setLocal(() => data = d);
                },
              ),
              DropdownButtonFormField<String>(
                initialValue: hora,
                decoration: const InputDecoration(labelText: 'Horário'),
                items:
                    [
                          '08:00',
                          '09:00',
                          '10:00',
                          '11:00',
                          '14:00',
                          '15:00',
                          '16:00',
                          '17:00',
                        ]
                        .map((h) => DropdownMenuItem(value: h, child: Text(h)))
                        .toList(),
                onChanged: (v) => hora = v!,
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
              child: const Text('Agendar'),
            ),
          ],
        ),
      ),
    );
    if (ok != true || medico == null) return;
    final iso =
        '${data.year}-${data.month.toString().padLeft(2, '0')}-${data.day.toString().padLeft(2, '0')}';
    await PacienteService.agendarTeleconsulta({
      'idMedico': medico!['id'],
      'data': iso,
      'horario': hora,
      'status': 'Agendada',
      'duracao': '30 min',
      'tipo': 'Teleconsulta',
    });
    await _carregar();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF5F5F5),
    appBar: AppBar(
      title: const Text('Teleconsultas'),
      backgroundColor: verde,
      foregroundColor: Colors.white,
    ),
    floatingActionButton: FloatingActionButton.extended(
      onPressed: _agendar,
      backgroundColor: verde,
      foregroundColor: Colors.white,
      icon: const Icon(Icons.add),
      label: const Text('Agendar'),
    ),
    body: carregando
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _carregar,
            child: consultas.isEmpty
                ? ListView(
                    children: const [
                      SizedBox(height: 180),
                      Center(child: Text('Nenhuma teleconsulta agendada.')),
                    ],
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: consultas.length,
                    itemBuilder: (_, i) {
                      final c = consultas[i];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: const CircleAvatar(
                            backgroundColor: verde,
                            child: Icon(Icons.videocam, color: Colors.white),
                          ),
                          title: Text(
                            _nomeMedico(c['idMedico']),
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text('${c['data']} às ${c['horario']}'),
                          trailing: Chip(
                            label: Text('${c['status'] ?? 'Agendada'}'),
                          ),
                        ),
                      );
                    },
                  ),
          ),
  );
}
