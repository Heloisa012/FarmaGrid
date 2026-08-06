import 'package:flutter/material.dart';
import 'detalhes_paciente.dart';

class TelaProntuarios extends StatefulWidget {
  const TelaProntuarios({super.key});

  @override
  _TelaProntuariosState createState() => _TelaProntuariosState();
}

class _TelaProntuariosState extends State<TelaProntuarios> {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corVerdeOliva = const Color(0xFF136A48);
  final Color corTealBotao = const Color(0xFF7FC6BB);
  final Color corFundoSite = const Color.fromARGB(255, 245, 245, 245);

  final _buscaController = TextEditingController();

  final List<Map<String, dynamic>> _pacientes = [
    {
      'nome': 'Maria Silva, 68 anos',
      'cpf': '***.***.***-55',
      'condicoes': ['Hipertensão', 'Diabetes tipo 2'],
      'consultas': '24',
      'receitas': '3',
      'ultima': '28/10',
    },
    {
      'nome': 'Maria Silva, 68 anos',
      'cpf': '***.***.***-55',
      'condicoes': ['Hipertensão', 'Diabetes tipo 2'],
      'consultas': '24',
      'receitas': '3',
      'ultima': '28/10',
    },
    {
      'nome': 'Maria Silva, 68 anos',
      'cpf': '***.***.***-55',
      'condicoes': ['Hipertensão', 'Diabetes tipo 2'],
      'consultas': '24',
      'receitas': '3',
      'ultima': '28/10',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: corFundoSite,
      body: Column(
        children: [
          _construirCabecalho(context),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 25),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Meus Pacientes",
                    style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),
                  ..._pacientes.map((p) => _construirCardPaciente(context, p)).toList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _construirCabecalho(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 60, left: 25, right: 25, bottom: 25),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF59AA53),
            const Color(0xFF89C6B1).withValues(alpha: 1.0),
          ],
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: const Icon(Icons.arrow_back, color: Colors.white, size: 26),
              ),
              const SizedBox(width: 15),
              const Text(
                "Prontuários",
                style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 20),
          TextField(
            controller: _buscaController,
            decoration: InputDecoration(
              hintText: "Buscar paciente pro nome ou CPF",
              hintStyle: TextStyle(color: Colors.grey[400], fontSize: 13),
              prefixIcon: Icon(Icons.search, color: Colors.grey[400]),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _construirCardPaciente(BuildContext context, Map<String, dynamic> p) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: corTealBotao.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.person_outline, color: corVerdeOliva, size: 26),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p['nome'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2E2E2E))),
                    Text(p['cpf'], style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => TelaDetalhesPaciente(
                        nome: p['nome'],
                        cpfMascarado: p['cpf'],
                      ),
                    ),
                  );
                },
                child: Icon(Icons.remove_red_eye_outlined, color: corVerdePrimario, size: 22),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            children: (p['condicoes'] as List<String>)
                .map((c) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: corVerdePrimario.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(c, style: TextStyle(color: corVerdeOliva, fontSize: 11, fontWeight: FontWeight.w600)),
                    ))
                .toList(),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _statBox(p['consultas'], "Consultas"),
              const SizedBox(width: 10),
              _statBox(p['receitas'], "Receitas"),
              const SizedBox(width: 10),
              _statBox(p['ultima'], "Última"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statBox(String valor, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: corFundoSite,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: corVerdePrimario.withValues(alpha: 0.15)),
        ),
        child: Column(
          children: [
            Text(valor, style: TextStyle(color: corVerdePrimario, fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 3),
            Text(label, style: const TextStyle(color: Colors.grey, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _buscaController.dispose();
    super.dispose();
  }
}
