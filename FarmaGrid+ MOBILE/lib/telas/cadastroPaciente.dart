import 'package:flutter/material.dart';
import 'package:farmagridd/telas/paciente.dart';
import 'login.dart';

List<Paciente> listaPacientes = [];

const Color _verde    = Color(0xFF59AA53);
const Color _oliva    = Color(0xFF136A48);
const Color _teal     = Color(0xFF7FC6BB);
const Color _fundo    = Color.fromARGB(255, 245, 245, 245);
const Color _verdeFraco = Color(0xFFE8F5E9);

class TelaCadastroPaciente extends StatefulWidget {
  const TelaCadastroPaciente({super.key});

  @override
  State<TelaCadastroPaciente> createState() => _TelaCadastroPacienteState();
}

class _TelaCadastroPacienteState extends State<TelaCadastroPaciente> {

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController _nomeCtrl      = TextEditingController();
  final TextEditingController _emailCtrl     = TextEditingController();
  final TextEditingController _senhaCtrl     = TextEditingController();
  final TextEditingController _confirmCtrl   = TextEditingController();
  final TextEditingController _telefoneCtrl  = TextEditingController();

  bool _possuiPlano   = false;
  bool _aceitaTermos  = false;

  bool _receberNotif  = false;

  String _tipoSanguineo = "";
  String _genero        = "";

  bool _senhaVisivel = false;

  void _mostrar() {
    for (Paciente p in listaPacientes) {
      print(p.toString());
    }
  }

  void _cadastrar() {
    if (_tipoSanguineo.isEmpty) {
      _alertaErro("Selecione o tipo sanguíneo.");
      return;
    }
    if (_genero.isEmpty) {
      _alertaErro("Selecione o gênero.");
      return;
    }
    if (!_aceitaTermos) {
      _alertaErro("Você deve aceitar os Termos de Uso.");
      return;
    }

    if (_formKey.currentState!.validate()) {
      Paciente p = Paciente(
        _emailCtrl.text.trim(),
        _senhaCtrl.text,
        _nomeCtrl.text.trim(),
        _telefoneCtrl.text.trim(),
        _receberNotif,
        _possuiPlano,
        _aceitaTermos,
        _tipoSanguineo,
        _genero,
      );

      listaPacientes.add(p);
      _mostrar();
      _limpar();

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: _verde),
              SizedBox(width: 8),
              Text("Cadastro realizado!"),
            ],
          ),
          content: const Text("Sua conta foi criada com sucesso.\nFaça login para continuar."),
          actions: [
            TextButton(
              child: const Text("OK", style: TextStyle(color: _verde, fontWeight: FontWeight.bold)),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => TelaLogin()),
                );
              },
            ),
          ],
        ),
      );
    }
  }

  void _alertaErro(String msg) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.orange),
            SizedBox(width: 8),
            Text("Atenção"),
          ],
        ),
        content: Text(msg),
        actions: [
          TextButton(
            child: const Text("OK", style: TextStyle(color: _verde, fontWeight: FontWeight.bold)),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  void _limpar() {
    _nomeCtrl.clear();
    _emailCtrl.clear();
    _senhaCtrl.clear();
    _confirmCtrl.clear();
    _telefoneCtrl.clear();
    setState(() {
      _possuiPlano   = false;
      _aceitaTermos  = false;
      _receberNotif  = false;
      _tipoSanguineo = "";
      _genero        = "";
    });
  }

  @override
  void dispose() {
    _nomeCtrl.dispose();
    _emailCtrl.dispose();
    _senhaCtrl.dispose();
    _confirmCtrl.dispose();
    _telefoneCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _fundo,
      body: Column(
        children: [
          _cabecalho(context),
          Expanded(
            child: Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 25),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    _secao("Dados Pessoais", Icons.person_outline),
                    const SizedBox(height: 12),

                    _campo(
                      controller: _nomeCtrl,
                      label: "Nome completo",
                      icone: Icons.person_outline,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) return "Campo obrigatório!";
                        if (v.trim().length < 3) return "Nome muito curto.";
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _campo(
                      controller: _emailCtrl,
                      label: "E-mail",
                      icone: Icons.email_outlined,
                      teclado: TextInputType.emailAddress,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) return "Campo obrigatório!";
                        if (!v.contains("@") || !v.contains(".")) return "E-mail inválido.";
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _campo(
                      controller: _telefoneCtrl,
                      label: "Telefone / WhatsApp",
                      icone: Icons.phone_outlined,
                      teclado: TextInputType.phone,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) return "Campo obrigatório!";
                        if (v.trim().length < 10) return "Telefone inválido.";
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _campoSenha(
                      controller: _senhaCtrl,
                      label: "Senha",
                      visivel: _senhaVisivel,
                      onToggle: () => setState(() => _senhaVisivel = !_senhaVisivel),
                      validator: (v) {
                        if (v == null || v.isEmpty) return "Campo obrigatório!";
                        if (v.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),

                    _campoSenha(
                      controller: _confirmCtrl,
                      label: "Confirmar senha",
                      visivel: _senhaVisivel,
                      onToggle: () => setState(() => _senhaVisivel = !_senhaVisivel),
                      validator: (v) {
                        if (v == null || v.isEmpty) return "Campo obrigatório!";
                        if (v != _senhaCtrl.text) return "As senhas não coincidem.";
                        return null;
                      },
                    ),

                    const SizedBox(height: 28),

                    _secao("Gênero", Icons.wc_outlined),
                    const SizedBox(height: 8),
                    _cardOpcoes(
                      child: Column(
                        children: ["Masculino", "Feminino", "Outro"].map((op) =>
                          RadioListTile<String>(
                            title: Text(op, style: const TextStyle(fontSize: 14)),
                            value: op,
                            groupValue: _genero,
                            activeColor: _verde,
                            dense: true,
                            onChanged: (v) => setState(() => _genero = v!),
                          ),
                        ).toList(),
                      ),
                    ),

                    const SizedBox(height: 20),

                    _secao("Tipo Sanguíneo", Icons.bloodtype_outlined),
                    const SizedBox(height: 8),
                    _cardOpcoes(
                      child: Wrap(
                        children: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((op) =>
                          SizedBox(
                            width: MediaQuery.of(context).size.width / 2 - 45,
                            child: RadioListTile<String>(
                              title: Text(op, style: const TextStyle(fontSize: 13)),
                              value: op,
                              groupValue: _tipoSanguineo,
                              activeColor: _verde,
                              dense: true,
                              onChanged: (v) => setState(() => _tipoSanguineo = v!),
                            ),
                          ),
                        ).toList(),
                      ),
                    ),

                    const SizedBox(height: 20),

                    _secao("Saúde & Preferências", Icons.health_and_safety_outlined),
                    const SizedBox(height: 8),
                    _cardOpcoes(
                      child: Column(
                        children: [
                          CheckboxListTile(
                            title: const Text("Possuo plano de saúde", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                            subtitle: const Text("Convênio médico ativo"),
                            secondary: const Icon(Icons.medical_services_outlined, color: _verde),
                            tileColor: _verdeFraco,
                            activeColor: _verde,
                            value: _possuiPlano,
                            onChanged: (v) => setState(() => _possuiPlano = v!),
                          ),

                          const SizedBox(height: 8),

                          CheckboxListTile(
                            title: const Text("Aceito os Termos de Uso", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                            subtitle: const Text("Li e concordo com a política de privacidade"),
                            secondary: const Icon(Icons.gavel_outlined, color: _verde),
                            tileColor: _verdeFraco,
                            activeColor: _verde,
                            value: _aceitaTermos,
                            onChanged: (v) => setState(() => _aceitaTermos = v!),
                          ),

                          const SizedBox(height: 8),

                          SwitchListTile(
                            title: const Text("Receber notificações", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                            subtitle: const Text("Lembretes de consultas e medicamentos"),
                            secondary: const Icon(Icons.notifications_outlined, color: _verde),
                            tileColor: _verdeFraco,
                            activeColor: _verde,
                            value: _receberNotif,
                            onChanged: (v) {
                              _receberNotif = v;
                              setState(() {});
                            },
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 30),

                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _cadastrar,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _verde,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                        ),
                        child: const Text(
                          "Cadastrar",
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    Center(
                      child: TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text(
                          "Já tenho uma conta",
                          style: TextStyle(color: _oliva, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cabecalho(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 60, left: 25, right: 25, bottom: 25),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [_verde, _teal],
        ),
        borderRadius: BorderRadius.only(
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
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Criar conta", style: TextStyle(color: Colors.white70, fontSize: 14)),
              Text("Cadastro de Paciente",
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _secao(String titulo, IconData icone) {
    return Row(
      children: [
        Icon(icone, color: _verde, size: 18),
        const SizedBox(width: 8),
        Text(titulo,
            style: const TextStyle(color: Color(0xFF2E2E2E), fontSize: 16, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _cardOpcoes({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: child,
      ),
    );
  }

  Widget _campo({
    required TextEditingController controller,
    required String label,
    required IconData icone,
    TextInputType teclado = TextInputType.text,
    required String? Function(String?) validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: teclado,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.grey),
        prefixIcon: Icon(icone, color: _verde, size: 20),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _verde, width: 2)),
        errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Colors.red, width: 1)),
        focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Colors.red, width: 2)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }

  Widget _campoSenha({
    required TextEditingController controller,
    required String label,
    required bool visivel,
    required VoidCallback onToggle,
    required String? Function(String?) validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: !visivel,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.grey),
        prefixIcon: const Icon(Icons.lock_outline, color: _verde, size: 20),
        suffixIcon: IconButton(
          icon: Icon(visivel ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: Colors.grey),
          onPressed: onToggle,
        ),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _verde, width: 2)),
        errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Colors.red, width: 1)),
        focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Colors.red, width: 2)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }
}
