import 'package:flutter/material.dart';

class TelaDetalhesPaciente extends StatefulWidget {
  final String nome;
  final String cpfMascarado;

  const TelaDetalhesPaciente({
    super.key,
    required this.nome,
    required this.cpfMascarado,
  });

  @override
  _TelaDetalhesPacienteState createState() => _TelaDetalhesPacienteState();
}

class _TelaDetalhesPacienteState extends State<TelaDetalhesPaciente>
    with SingleTickerProviderStateMixin {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corVerdeOliva = const Color(0xFF136A48);
  final Color corTealBotao = const Color(0xFF7FC6BB);
  final Color corFundoSite = const Color.fromARGB(255, 245, 245, 245);

  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: corFundoSite,
      body: Column(
        children: [
          _construirCabecalho(context),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25),
            child: _construirTabBar(),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _construirAbaProntuario(),
                _construirAbaSinaisVitais(),
                _construirAbaHistorico(),
              ],
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
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(Icons.arrow_back, color: Colors.white, size: 26),
          ),
          const SizedBox(height: 12),
          Text(
            widget.nome,
            style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
          ),
          Text(
            widget.cpfMascarado,
            style: TextStyle(color: Colors.white.withValues(alpha: 0.75), fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _construirTabBar() {
    return AnimatedBuilder(
      animation: _tabController,
      builder: (context, _) {
        return Row(
          children: List.generate(3, (i) {
            final labels = ["Prontuário", "Sinais Vitais", "Histórico"];
            final selecionado = _tabController.index == i;
            return GestureDetector(
              onTap: () => setState(() => _tabController.animateTo(i)),
              child: Container(
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                decoration: BoxDecoration(
                  color: selecionado ? corVerdePrimario : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: selecionado
                      ? [BoxShadow(color: corVerdePrimario.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4))]
                      : [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2))],
                ),
                child: Text(
                  labels[i],
                  style: TextStyle(
                    color: selecionado ? Colors.white : Colors.grey[600],
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _construirAbaProntuario() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Meus Pacientes",
            style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: corVerdePrimario.withValues(alpha: 0.3)),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Resumo do Paciente", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF2E2E2E))),
                const Divider(height: 20),
                _linhaResumo("Total de Consultas:", "24"),
                const SizedBox(height: 8),
                _linhaResumo("Receitas Ativas:", "3"),
                const SizedBox(height: 8),
                _linhaResumo("Última Consulta:", "28/10/2025"),
                const Divider(height: 20),
                const Text("Condições Crônicas:", style: TextStyle(color: Colors.grey, fontSize: 13)),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  children: [
                    _chip("Diabetes tipo 2"),
                    _chip("Hipertensão"),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Consulta de Rotina", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF2E2E2E))),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.calendar_today_outlined, size: 14, color: Colors.grey[500]),
                    const SizedBox(width: 5),
                    Text("28/10/2025", style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                  ],
                ),
                const SizedBox(height: 14),
                _infoBox("Diagnóstico:", "Hipertensão arterial controlada", corVerdePrimario.withValues(alpha: 0.08)),
                const SizedBox(height: 10),
                _infoBox("Prescrição:", "Losartana 50mg, Atenolol 25mg", corTealBotao.withValues(alpha: 0.15)),
                const SizedBox(height: 10),
                _infoBox("Observações:", "Paciente apresenta boa adesão ao tratamento.", corFundoSite),
              ],
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _construirAbaSinaisVitais() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Meus Pacientes",
            style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Sinais Vitais Recentes", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF2E2E2E))),
                const SizedBox(height: 15),
                _cardSinalVital("Pressão Arterial", "125/80 mmHg", "Normal", Colors.red[300]!, Colors.green),
                const Divider(height: 20),
                _cardSinalVital("Glicemia", "98 mg/dL", "Normal", Colors.purple[300]!, Colors.green),
                const Divider(height: 20),
                _cardSinalVital("Peso / Altura", "68 kg / 1.62 m", null, Colors.green[300]!, null),
                const Divider(height: 20),
                _cardSinalVital("IMC", "25.9", "Sobrepeso", Colors.purple[200]!, Colors.orange),
              ],
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _construirAbaHistorico() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Meus Pacientes",
            style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          const Text(
            "Últimas Consultas",
            style: TextStyle(color: Colors.grey, fontSize: 14),
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
            ),
            child: Row(
              children: [
                Container(
                  width: 4,
                  height: 40,
                  decoration: BoxDecoration(color: corTealBotao, borderRadius: BorderRadius.circular(10)),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Consulta de Rotina", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2E2E2E))),
                      SizedBox(height: 4),
                      Text("Hipertensão arterial controlada", style: TextStyle(color: Colors.grey, fontSize: 12)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: corTealBotao.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text("28/10/2025", style: TextStyle(color: corVerdeOliva, fontWeight: FontWeight.bold, fontSize: 11)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _linhaResumo(String label, String valor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
        Text(valor, style: TextStyle(color: corVerdePrimario, fontWeight: FontWeight.bold, fontSize: 14)),
      ],
    );
  }

  Widget _chip(String texto) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: corVerdePrimario.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(texto, style: TextStyle(color: corVerdeOliva, fontSize: 12, fontWeight: FontWeight.w600)),
    );
  }

  Widget _infoBox(String titulo, String conteudo, Color fundo) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: fundo, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(titulo, style: TextStyle(color: corVerdeOliva, fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 3),
          Text(conteudo, style: const TextStyle(color: Colors.grey, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _cardSinalVital(String nome, String valor, String? badge, Color iconColor, Color? badgeColor) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: iconColor.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(12)),
          child: Icon(Icons.show_chart, color: iconColor, size: 20),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(nome, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              const SizedBox(height: 2),
              Text(valor, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2E2E2E))),
            ],
          ),
        ),
        if (badge != null && badgeColor != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(color: badgeColor, borderRadius: BorderRadius.circular(8)),
            child: Text(badge, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
          ),
      ],
    );
  }
}
