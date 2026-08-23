import 'package:flutter/material.dart';
import '../../models/medico_models.dart';
import '../../services/auth_service.dart';
import '../../services/medico_service.dart';

class TelaPrescreverReceita extends StatefulWidget {
  const TelaPrescreverReceita({super.key});

  @override
  _TelaPrescreverReceitaState createState() => _TelaPrescreverReceitaState();
}

class _TelaPrescreverReceitaState extends State<TelaPrescreverReceita> {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corVerdeOliva = const Color(0xFF136A48);
  final Color corTealBotao = const Color(0xFF7FC6BB);
  final Color corFundoSite = const Color.fromARGB(255, 245, 245, 245);

  final _diagnosticoController = TextEditingController();
  final _medicamentoController = TextEditingController();
  final _dosageController = TextEditingController();
  final _duracaoController = TextEditingController();
  final _instrucaoController = TextEditingController();
  final _observacoesController = TextEditingController();
  List<PacienteMedico> _pacientes = const [];
  int? _idPaciente;
  bool _carregandoPacientes = true;
  bool _salvando = false;

  @override
  void initState() {
    super.initState();
    _carregarPacientes();
  }

  Future<void> _carregarPacientes() async {
    try {
      final pacientes = await MedicoService.listarPacientes();
      if (mounted) setState(() => _pacientes = pacientes);
    } catch (e) {
      if (mounted) _mensagem(e.toString(), erro: true);
    } finally {
      if (mounted) setState(() => _carregandoPacientes = false);
    }
  }

  Future<void> _gerarReceita() async {
    if (_idPaciente == null ||
        _medicamentoController.text.trim().isEmpty ||
        _dosageController.text.trim().isEmpty ||
        _duracaoController.text.trim().isEmpty) {
      _mensagem(
        'Selecione o paciente e preencha medicamento, dosagem e duração.',
        erro: true,
      );
      return;
    }
    setState(() => _salvando = true);
    try {
      final observacoes = [
        if (_diagnosticoController.text.trim().isNotEmpty)
          'Diagnóstico: ${_diagnosticoController.text.trim()}',
        if (_observacoesController.text.trim().isNotEmpty)
          _observacoesController.text.trim(),
      ].join('\n');
      await MedicoService.criarReceita(
        MedicoService.novaReceita(
          idPaciente: _idPaciente!,
          medicamento: _medicamentoController.text.trim(),
          dosagem: _dosageController.text.trim(),
          duracao: _duracaoController.text.trim(),
          instrucoes: _instrucaoController.text.trim(),
          observacoes: observacoes,
        ),
      );
      if (!mounted) return;
      _mensagem('Receita prescrita com sucesso.');
      _diagnosticoController.clear();
      _medicamentoController.clear();
      _dosageController.clear();
      _duracaoController.clear();
      _instrucaoController.clear();
      _observacoesController.clear();
    } on ApiException catch (e) {
      if (mounted) _mensagem(e.mensagem, erro: true);
    } finally {
      if (mounted) setState(() => _salvando = false);
    }
  }

  void _mensagem(String texto, {bool erro = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(texto),
        backgroundColor: erro ? Colors.red : corVerdePrimario,
      ),
    );
  }

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
                  _label("Paciente:"),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<int>(
                    initialValue: _idPaciente,
                    isExpanded: true,
                    decoration: _decoracaoCampo(
                      _carregandoPacientes
                          ? 'Carregando pacientes...'
                          : 'Selecione o paciente',
                      prefixIcon: Icons.person_outline,
                    ),
                    items: _pacientes
                        .map(
                          (p) => DropdownMenuItem(
                            value: p.id,
                            child: Text(p.nome),
                          ),
                        )
                        .toList(),
                    onChanged: _carregandoPacientes
                        ? null
                        : (id) => setState(() => _idPaciente = id),
                  ),
                  const SizedBox(height: 20),
                  _label("Diagnóstico:"),
                  const SizedBox(height: 8),
                  _campo(
                    controller: _diagnosticoController,
                    hint: "Informe o diagnóstico do paciente",
                  ),
                  const SizedBox(height: 25),
                  _construirSecaoMedicamento(),
                  const SizedBox(height: 25),
                  _label("Observações Adicionais"),
                  const SizedBox(height: 8),
                  _campoMultiline(
                    controller: _observacoesController,
                    hint: "Orientações gerais, cuidados pessoais, etc.",
                    linhas: 4,
                  ),
                  const SizedBox(height: 30),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _salvando ? null : _gerarReceita,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: corVerdePrimario,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        textStyle: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      child: _salvando
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text("Gerar Receita"),
                    ),
                  ),
                  const SizedBox(height: 20),
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
            "Prescrever Receita",
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

  Widget _construirSecaoMedicamento() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: corVerdePrimario.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
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
              Icon(
                Icons.medication_outlined,
                color: corVerdePrimario,
                size: 20,
              ),
              const SizedBox(width: 8),
              const Text(
                "Adicionar Medicamento",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: Color(0xFF2E2E2E),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          _label("Medicamento:"),
          const SizedBox(height: 8),
          _campo(
            controller: _medicamentoController,
            hint: "Digite o nome do medicamento",
          ),
          const SizedBox(height: 15),
          _label("Dosagem:"),
          const SizedBox(height: 8),
          _campo(controller: _dosageController, hint: "Ex. 1 comprimido"),
          const SizedBox(height: 15),
          _label("Duração do Tratamento:"),
          const SizedBox(height: 8),
          _campo(controller: _duracaoController, hint: "Informe a duração"),
          const SizedBox(height: 15),
          _label("Instruções Adicionais:"),
          const SizedBox(height: 8),
          _campo(
            controller: _instrucaoController,
            hint: "Ex. Tomar após o almoço",
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: corVerdePrimario,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              child: const Text("Adicionar Medicamento"),
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String texto) {
    return Text(
      texto,
      style: const TextStyle(
        color: Color(0xFF2E2E2E),
        fontWeight: FontWeight.w600,
        fontSize: 14,
      ),
    );
  }

  Widget _campo({
    required TextEditingController controller,
    required String hint,
    IconData? prefixIcon,
  }) {
    return TextField(
      controller: controller,
      decoration: _decoracaoCampo(hint, prefixIcon: prefixIcon),
    );
  }

  InputDecoration _decoracaoCampo(String hint, {IconData? prefixIcon}) =>
      InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey[400], fontSize: 13),
        prefixIcon: prefixIcon == null
            ? null
            : Icon(prefixIcon, color: Colors.grey[400], size: 20),
        filled: true,
        fillColor: const Color(0xFFF0F5F0),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
      );

  Widget _campoMultiline({
    required TextEditingController controller,
    required String hint,
    int linhas = 3,
  }) {
    return TextField(
      controller: controller,
      maxLines: linhas,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey[400], fontSize: 13),
        filled: true,
        fillColor: const Color(0xFFF0F5F0),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _diagnosticoController.dispose();
    _medicamentoController.dispose();
    _dosageController.dispose();
    _duracaoController.dispose();
    _instrucaoController.dispose();
    _observacoesController.dispose();
    super.dispose();
  }
}
