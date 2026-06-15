import 'package:flutter/material.dart';

class TelaFarmaciasProximas extends StatefulWidget {
  const TelaFarmaciasProximas({super.key});

  @override
  State<TelaFarmaciasProximas> createState() => _TelaFarmaciasProximasState();
}

class _TelaFarmaciasProximasState extends State<TelaFarmaciasProximas> {
  final Color corVerdePrimario = const Color(0xFF59AA53);
  final Color corTeal = const Color(0xFF7FC6BB);
  final Color corFundoSite = const Color(0xFFF8F9F5);

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
                    "Farmácias Próximas",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: Color(0xFF436B5E),
                    ),
                  ),
                  const SizedBox(height: 20),
                  _buildGridFarmacias(),
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
      padding: const EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 30),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [corVerdePrimario, corVerdePrimario.withValues(alpha: 0.8)],
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(35),
          bottomRight: Radius.circular(35),
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
                "Farmácias",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(25),
            ),
            child: const TextField(
              decoration: InputDecoration(
                hintText: "Buscar farmácias...",
                prefixIcon: Icon(Icons.search, color: Colors.grey),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGridFarmacias() {
    final List<Map<String, dynamic>> farmacias = [
      {"nome": "Farmácia São João", "distancia": "1.2 km", "aberto": true},
      {"nome": "Drogaria Popular", "distancia": "1.4 km", "aberto": true},
      {"nome": "Farmácia Bem Estar", "distancia": "0.8 km", "aberto": true},
      {"nome": "Farmácia Saúde", "distancia": "2.1 km", "aberto": true},
      {"nome": "Droga Raia", "distancia": "0.3 km", "aberto": false},
      {"nome": "Drogasil", "distancia": "2.5 km", "aberto": false},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: farmacias.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.85,
        crossAxisSpacing: 15,
        mainAxisSpacing: 15,
      ),
      itemBuilder: (context, index) {
        final farmacia = farmacias[index];
        return _buildCardFarmacia(
          farmacia["nome"],
          farmacia["distancia"],
          farmacia["aberto"],
        );
      },
    );
  }

  Widget _buildCardFarmacia(String nome, String distancia, bool estaAberto) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.add_location_alt, color: corVerdePrimario, size: 24),
              const SizedBox(width: 8),
              Text(
                distancia,
                style: const TextStyle(
                  color: Colors.grey,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          Text(
            nome,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
            decoration: BoxDecoration(
              color: estaAberto 
                  ? corVerdePrimario.withOpacity(0.7) 
                  : Colors.grey.withOpacity(0.3),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              estaAberto ? "Aberto" : "Fechado",
              style: TextStyle(
                color: estaAberto ? Colors.white : Colors.grey[700],
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}