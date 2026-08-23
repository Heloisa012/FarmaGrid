import 'package:flutter/material.dart';
import '../../services/paciente_service.dart';

class TelaFarmaciasProximas extends StatefulWidget {
  const TelaFarmaciasProximas({super.key});
  @override
  State<TelaFarmaciasProximas> createState() => _TelaFarmaciasProximasState();
}

class _TelaFarmaciasProximasState extends State<TelaFarmaciasProximas> {
  static const verde = Color(0xFF59AA53);
  final busca = TextEditingController();
  List<Map<String, dynamic>> farmacias = [];
  bool carregando = true;
  String? erro;
  String filtro = 'todas';

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    setState(() {
      carregando = true;
      erro = null;
    });
    try {
      final lista = await PacienteService.listarFarmaciasProximas();
      if (mounted) setState(() => farmacias = lista);
    } catch (e) {
      if (mounted) setState(() => erro = '$e');
    } finally {
      if (mounted) setState(() => carregando = false);
    }
  }

  List<Map<String, dynamic>> get filtradas => farmacias.where((f) {
    final nomeOk = '${f['nome'] ?? ''}'.toLowerCase().contains(
      busca.text.toLowerCase(),
    );
    final aberto = f['aberto'];
    return nomeOk &&
        (filtro == 'todas' ||
            (filtro == 'abertas' && aberto == true) ||
            (filtro == 'fechadas' && aberto == false));
  }).toList();
  @override
  void dispose() {
    busca.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8F9F5),
    appBar: AppBar(
      title: const Text('Farmácias próximas'),
      foregroundColor: Colors.white,
      backgroundColor: verde,
    ),
    body: RefreshIndicator(
      onRefresh: _carregar,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: busca,
            onChanged: (_) => setState(() {}),
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Buscar farmácia',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'todas', label: Text('Todas')),
              ButtonSegment(value: 'abertas', label: Text('Abertas')),
              ButtonSegment(value: 'fechadas', label: Text('Fechadas')),
            ],
            selected: {filtro},
            onSelectionChanged: (v) => setState(() => filtro = v.first),
          ),
          const SizedBox(height: 20),
          if (carregando)
            const Center(child: CircularProgressIndicator())
          else if (erro != null)
            _mensagem(Icons.location_off_outlined, erro!, botao: true)
          else if (filtradas.isEmpty)
            _mensagem(
              Icons.local_pharmacy_outlined,
              'Nenhuma farmácia encontrada para o endereço cadastrado.',
            )
          else
            ...filtradas.map(
              (f) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: verde,
                    child: Icon(Icons.local_pharmacy, color: Colors.white),
                  ),
                  title: Text(
                    '${f['nome'] ?? ''}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    '${f['endereco'] ?? ''}\n${f['aberto'] == true
                        ? 'Aberta agora'
                        : f['aberto'] == false
                        ? 'Fechada agora'
                        : 'Horário não informado'}',
                  ),
                  isThreeLine: true,
                  trailing: Icon(
                    f['aberto'] == true ? Icons.check_circle : Icons.schedule,
                    color: f['aberto'] == true ? verde : Colors.orange,
                  ),
                ),
              ),
            ),
          const Padding(
            padding: EdgeInsets.only(top: 12),
            child: Text(
              'Dados e horários fornecidos pelo Google Places.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 11),
            ),
          ),
        ],
      ),
    ),
  );
  Widget _mensagem(IconData icon, String texto, {bool botao = false}) =>
      Padding(
        padding: const EdgeInsets.all(30),
        child: Column(
          children: [
            Icon(icon, size: 54, color: Colors.grey),
            const SizedBox(height: 12),
            Text(texto, textAlign: TextAlign.center),
            if (botao)
              TextButton(
                onPressed: _carregar,
                child: const Text('Tentar novamente'),
              ),
          ],
        ),
      );
}
