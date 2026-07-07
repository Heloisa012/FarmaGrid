import 'package:flutter/material.dart';
import 'cadastroPaciente.dart';
import 'cadastroMedico.dart';

const Color corFundoClaro = Color.fromARGB(255, 245, 245, 245);
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

class TelaSelecaoCadastro extends StatefulWidget {
  @override
  _TelaSelecaoCadastroState createState() => _TelaSelecaoCadastroState();
}

class _TelaSelecaoCadastroState extends State<TelaSelecaoCadastro> {
  String perfilSelecionado = 'Paciente';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white, size: 30),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [corTeal, corVerdePrimario],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Criar Conta", style: estiloTitulo),
            const Text("Junte-se ao FarmaGrid+", style: estiloSubtitulo),
            const SizedBox(height: 30),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 30),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: corFundoClaro,
                borderRadius: BorderRadius.circular(30),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Cadastrar como:",
                    style: TextStyle(
                      color: corVerdeEscuro,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 15),
                  _construirCardSelecao(
                    Icons.person_outline,
                    "Paciente",
                    "Acesso a consultas e medicamentos",
                  ),
                  _construirCardSelecao(
                    Icons.medical_services,
                    "Médico/Clínica",
                    "Gerencie consultas e prontuários",
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        if (perfilSelecionado == 'Paciente') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => TelaCadastroPaciente()),
                          );
                        }
                        if (perfilSelecionado == 'Médico/Clínica') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => TelaCadastroMedico()),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: corVerdePrimario,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      child: const Text(
                        "Continuar",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _construirCardSelecao(IconData icone, String titulo, String subtitulo) {
    bool selecionado = perfilSelecionado == titulo;
    return GestureDetector(
      onTap: () => setState(() => perfilSelecionado = titulo),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selecionado ? corVerdePrimario : Colors.grey.shade300,
            width: 2,
          ),
          color: selecionado ? corVerdePrimario.withValues(alpha: 0.08) : Colors.transparent,
        ),
        child: Row(
          children: [
            Icon(icone, size: 40, color: selecionado ? corVerdePrimario : Colors.grey),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: selecionado ? corVerdePrimario : Colors.grey.shade700,
                    ),
                  ),
                  Text(
                    subtitulo,
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
