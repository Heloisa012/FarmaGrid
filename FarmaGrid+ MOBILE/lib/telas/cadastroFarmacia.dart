import 'package:flutter/material.dart';

const Color corFundoClaro = const Color.fromARGB(255, 245, 245, 245);
const Color corVerdePrimario = Color(0xFF59AA53);
const Color corVerdeEscuro = Color(0xFF4F8946);
const Color corTeal = Color(0xFF7FC6BB);

const TextStyle estiloTitulo = TextStyle(
  fontFamily: 'Inter',
  fontSize: 32,
  fontWeight: FontWeight.w500,
  color: Colors.white,
);

const TextStyle estiloSubtitulo = TextStyle(
  fontFamily: 'Inter',
  color: Colors.white70, 
  fontSize: 16,
  fontWeight: FontWeight.w400, 
);

class TelaCadastroFarmacia extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
      height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [Color(0xFF7FC6BB), Color(0xFF59AA53)],
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(top: 60, bottom: 40),
          child: Column(
            children: [
              const Text("Criar Conta", style: TextStyle(fontSize: 32, color: Colors.white, fontWeight: FontWeight.w500)),
              const Text("Junte-se ao FarmaGrid", style: TextStyle(color: Colors.white70, fontSize: 16)),
              const SizedBox(height: 20),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 25),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(color:const Color.fromARGB(255, 245, 245, 245), borderRadius: BorderRadius.circular(30)),
                child: Column(
                  children: [
                    _botaoVoltarInterno(context),
                    _campo("Nome da Farmácia:", "Ex. Farmácia São João"),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(flex: 2, child: _campo("CNPJ:", "00.000.000/0000-00")),
                        const SizedBox(width: 10),
                        Expanded(flex: 1, child: _campo("CEP:", "00000-000")),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(flex: 1, child: _campo("Nº:", "")),
                        const SizedBox(width: 10),
                        Expanded(flex: 2, child: _campo("Telefone:", "(00) 00000-0000")),
                      ],
                    ),
                    const SizedBox(height: 10),
                    _campo("Cidade:", "Nome da cidade"),
                    const SizedBox(height: 10),
                    _campo("Senha:", "********", obscurecer: true),
                    const SizedBox(height: 10),
                    _campo("Confirmar Senha:", "********", obscurecer: true),
                    const SizedBox(height: 25),
                    _botaoFinalizar(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  Widget _botaoVoltarInterno(BuildContext context) {
    return Row(
      children: [
        IconButton(icon: const Icon(Icons.arrow_back, color: Color(0xFF4F8946)), onPressed: () => Navigator.pop(context)),
        GestureDetector(
          onTap: () => Navigator.pop(context),
          child: const Text("Voltar", style: TextStyle(color: Color(0xFF4F8946), fontSize: 18, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _campo(String rotulo, String dica, {bool obscurecer = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(rotulo, style: const TextStyle(color: Color(0xFF4F8946), fontWeight: FontWeight.bold)),
        const SizedBox(height: 5),
        TextField(
          obscureText: obscurecer,
          decoration: InputDecoration(
            hintText: dica,
            filled: true,
            fillColor: const Color(0xFF59AA53).withAlpha(25),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          ),
        ),
      ],
    );
  }

  Widget _botaoFinalizar() {
    return SizedBox(
      width: double.infinity, height: 50,
      child: ElevatedButton(
        onPressed: () {},
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF59AA53), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
        child: const Text("Criar conta", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      ),
    );
  }
}

