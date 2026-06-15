import 'package:farmagridd/telas/cadastroFarmacia.dart';
import 'package:flutter/material.dart';

class TelaDescontos extends StatefulWidget {
  const TelaDescontos({super.key});

  @override
  State<TelaDescontos> createState() => _TelaDescontosState();
}

class _TelaDescontosState extends State<TelaDescontos> {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corFundoSite = const Color(0xFFF5F5F5);
  final Color corBegeCard = const Color(0xFFFDFCF4);
  final Color corTeal = Color(0xFF7FC6BB);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: corFundoSite,
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Descontos Disponíveis",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF436B5E)),
                  ),
                  const SizedBox(height: 20),
                  _buildCardDesconto("Farmácia São João", "Medicamentos", "30%", "30/11/2025"),
                  const SizedBox(height: 15),
                  _buildCardDesconto("Farmácia Saúde", "Genéricos", "25%", "27/11/2025"),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 40),
    decoration: BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF89C6B1).withValues(alpha: 1.0),
          const Color(0xFF59AA53), 
        ],
      ),
      borderRadius: const BorderRadius.only(
        bottomLeft: Radius.circular(40),
        bottomRight: Radius.circular(40),
      ),
    ),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
              const Text(
                "Clube FarmaGrid+",
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Você é membro Premium!", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text("Aproveite descontos exclusivos", style: TextStyle(color: Colors.grey, fontSize: 13)),
                      ],
                    ),
                    Icon(Icons.stars, color: corVerdePrimario, size: 40),
                  ],
                ),
                const SizedBox(height: 15),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: corVerdePrimario,
                    minimumSize: const Size(double.infinity, 45),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => TelaClube()));
                  },
                  child: const Text("Mostrar comprovante", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardDesconto(String farmacia, String categoria, String porcentagem, String validade) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: corVerdePrimario.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            child: Stack(
              children: [
                Image.asset('assets/images/medicamentos.png', height: 120, width: double.infinity, fit: BoxFit.cover),
                Positioned(
                  right: 15, bottom: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                    child: Text(porcentagem, style: TextStyle(color: corVerdePrimario, fontWeight: FontWeight.bold, fontSize: 18)),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(15),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(farmacia, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 5),
                Row(
                  children: [
                    Icon(Icons.local_offer, size: 14, color: corVerdePrimario),
                    const SizedBox(width: 5),
                    Text(categoria, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 14, color: Colors.grey),
                    const SizedBox(width: 5),
                    Text("Válido até $validade", style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  ],
                ),
                const SizedBox(height: 15),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: corVerdePrimario.withValues(alpha: 0.2),
                    foregroundColor: corVerdePrimario,
                    elevation: 0,
                    minimumSize: const Size(double.infinity, 40),
                    shape: StadiumBorder(),
                  ),
                  onPressed: () {},
                  child: const Text("Ativar Desconto", style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}

class TelaClube extends StatelessWidget {
  final Color corVerdePrimario = const Color(0xFF59AA53);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
       
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [corTeal, corVerdePrimario],
          ),
        ),
        child: Center(
          child: Column(
            children: [
              const SizedBox(height: 60),
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  label: const Text(
                    "Voltar",
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                ),
              ),
              const Spacer(),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 30),
                padding: const EdgeInsets.all(30),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    )
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 35,
                      backgroundColor: corVerdePrimario.withValues(alpha: 0.1),
                      child: Icon(Icons.verified, color: corVerdePrimario, size: 40),
                    ),
                    const SizedBox(height: 15),
                    const Text(
                      "Clube FarmaGrid+",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                    ),
                    const Text(
                      "Membro Premium",
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 30),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: corVerdePrimario.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        children: [
                          Text(
                            "ID do Membro",
                            style: TextStyle(
                                color: corVerdePrimario,
                                fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            "FG-2025-1234",
                            style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.5),
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            "Válido até 31/12/2025",
                            style: TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),
                    _buildRegra(Icons.check_circle, "Descontos exclusivos até 40%"),
                    const SizedBox(height: 10),
                    _buildRegra(Icons.check_circle, "Entrega grátis em pedidos"),
                  ],
                ),
              ),
              const Spacer(flex: 2),
            ],
          ),
        ),
      ),
    );
  }

  

  Widget _buildRegra(IconData icon, String texto) {
    return Row(
      children: [
        Icon(icon, color: corVerdePrimario, size: 20),
        const SizedBox(width: 10),
        Text(texto, style: const TextStyle(fontWeight: FontWeight.w500, color: Color(0xFF436B5E))),
      ],
    );
  }
}