import 'package:flutter/material.dart';

class TelaRelatorios extends StatelessWidget {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corVerdeOliva = const Color(0xFF136A48);
  final Color corTealBotao = const Color(0xFF7FC6BB);
  final Color corFundoSite = const Color.fromARGB(255, 245, 245, 245);

  const TelaRelatorios({super.key});

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
                  _construirCardAnalise(),
                  const SizedBox(height: 30),
                  const Text(
                    "Visão geral do mês",
                    style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),
                  _construirGridVisaoGeral(),
                  const SizedBox(height: 30),
                  const Text(
                    "Consultas por Tipo",
                    style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),
                  _construirConsultasPorTipo(),
                  const SizedBox(height: 30),
                  const Text(
                    "Diagnósticos Mais Frequentes",
                    style: TextStyle(color: Color(0xFF2E2E2E), fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),
                  _construirDiagnosticos(),
                  const SizedBox(height: 25),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.download_outlined, size: 18),
                      label: const Text("Relatório Mensal Completo"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: corVerdePrimario,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),
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
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(Icons.arrow_back, color: Colors.white, size: 26),
          ),
          const SizedBox(width: 15),
          const Text(
            "Relatórios",
            style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _construirCardAnalise() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 15, offset: const Offset(0, 6))],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: corVerdePrimario.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(Icons.bar_chart_outlined, color: corVerdeOliva, size: 28),
          ),
          const SizedBox(width: 15),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Análise de Desempenho", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF2E2E2E))),
              SizedBox(height: 3),
              Text("Outubro 2025", style: TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _construirGridVisaoGeral() {
    return Row(
      children: [
        Expanded(child: _cardMetrica("124", "Consultas Realizadas", "+12% vs mês anterior", Icons.calendar_today_outlined)),
        const SizedBox(width: 15),
        Expanded(child: _cardMetrica("156", "Receitas Emitidas", "+15% vs mês anterior", Icons.description_outlined)),
      ],
    );
  }

  Widget _cardMetrica(String valor, String titulo, String rodape, IconData icone) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: corVerdePrimario,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: corVerdePrimario.withValues(alpha: 0.3), blurRadius: 12, offset: const Offset(0, 6))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icone, color: Colors.white.withValues(alpha: 0.8), size: 22),
          const SizedBox(height: 8),
          Text(valor, style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(titulo, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(rodape, style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 11)),
        ],
      ),
    );
  }

  Widget _construirConsultasPorTipo() {
    final itens = [
      {"tipo": "Teleconsultas", "qtd": 78, "pct": "63%"},
      {"tipo": "Retornos", "qtd": 32, "pct": "26%"},
      {"tipo": "Primeira Consulta", "qtd": 14, "pct": "11%"},
    ];
    final total = 124.0;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: itens.map((item) {
          final pct = (item['qtd'] as int) / total;
          return Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(item['tipo'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF2E2E2E))),
                    Text(item['pct'] as String, style: TextStyle(color: corVerdePrimario, fontWeight: FontWeight.bold, fontSize: 13)),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: pct,
                    backgroundColor: corFundoSite,
                    color: corVerdePrimario,
                    minHeight: 8,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _construirDiagnosticos() {
    final lista = [
      {"rank": "1", "nome": "Hipertensão Arterial", "casos": "45 casos"},
      {"rank": "2", "nome": "Diabetes tipo 2", "casos": "32 casos"},
      {"rank": "3", "nome": "Infecções Respiratórias", "casos": "28 casos"},
    ];
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: lista.map((item) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              children: [
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(color: corVerdePrimario, borderRadius: BorderRadius.circular(8)),
                  child: Center(
                    child: Text(item['rank']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(item['nome']!, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF2E2E2E))),
                ),
                Text(item['casos']!, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
