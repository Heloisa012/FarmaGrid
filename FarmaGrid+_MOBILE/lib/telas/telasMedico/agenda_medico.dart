import 'package:flutter/material.dart';
import 'package:farmagridd/app_theme.dart';

class TelaAgendaMedico extends StatefulWidget {
  const TelaAgendaMedico({super.key});

  @override
  State<TelaAgendaMedico> createState() => _TelaAgendaMedicoState();
}

class _TelaAgendaMedicoState extends State<TelaAgendaMedico> {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corVerdeOliva = const Color(0xFF136A48);
  final Color corTealBotao = const Color(0xFF7FC6BB);

  final _themeCtrl = AppThemeController();

  @override
  void initState() {
    super.initState();
    _themeCtrl.addListener(() => setState(() {}));
  }

  Color get corFundo => _themeCtrl.darkMode ? const Color(0xFF121212) : const Color.fromARGB(255, 245, 245, 245);
  Color get corCard  => _themeCtrl.darkMode ? const Color(0xFF1E1E1E) : Colors.white;
  Color get corTexto => _themeCtrl.darkMode ? Colors.white : const Color(0xFF2E2E2E);
  Color get corSubtexto => _themeCtrl.darkMode ? Colors.white60 : Colors.grey;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: corFundo,
      body: Column(
        children: [
          _construirCabecalho(context),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 25),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _construirCardProximoAtendimento(),
                  const SizedBox(height: 30),
                  Text(
                    "Agendadas",
                    style: TextStyle(
                      color: corTexto,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 15),
                  _construirCardConsulta("Heloisa Pola Argentin", "Hoje", "15:00", mostrarBotao: true),
                  _construirCardConsulta("João Alves", "Hoje", "16:00", mostrarBotao: false),
                  _construirCardConsulta("Ana Costa", "Hoje", "17:00", mostrarBotao: false),
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
            "Agenda",
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _construirCardProximoAtendimento() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: corCard,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: _themeCtrl.darkMode ? 0.2 : 0.06),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: corVerdePrimario.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(Icons.videocam_outlined, color: corVerdeOliva, size: 28),
          ),
          const SizedBox(width: 15),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Próximo Atendimento",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: corTexto),
              ),
              const SizedBox(height: 3),
              Text(
                "Hoje às 15:00",
                style: TextStyle(color: corSubtexto, fontSize: 13),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _construirCardConsulta(String nome, String data, String hora, {required bool mostrarBotao}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: corCard,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: _themeCtrl.darkMode ? 0.2 : 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 5,
                height: 40,
                decoration: BoxDecoration(
                  color: corTealBotao,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      nome,
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: corTexto),
                    ),
                    Text(
                      "Paciente",
                      style: TextStyle(color: corSubtexto, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const SizedBox(width: 17),
              Icon(Icons.calendar_today_outlined, size: 14, color: corSubtexto),
              const SizedBox(width: 5),
              Text(data, style: TextStyle(color: corSubtexto, fontSize: 13)),
              const SizedBox(width: 15),
              Icon(Icons.access_time_outlined, size: 14, color: corSubtexto),
              const SizedBox(width: 5),
              Text(hora, style: TextStyle(color: corSubtexto, fontSize: 13)),
            ],
          ),
          if (mostrarBotao) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.videocam_outlined, size: 16),
                label: const Text("Entrar na consulta"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: corVerdePrimario,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
