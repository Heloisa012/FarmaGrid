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

  final TextEditingController _buscaCtrl = TextEditingController();
  String _termoBusca = '';

  String _filtroStatus = 'todos';

  static const List<Map<String, dynamic>> _todasFarmacias = [
    {"nome": "Farmácia São João",  "distancia": "1.2 km", "distKm": 1.2, "aberto": true},
    {"nome": "Drogaria Popular",   "distancia": "1.4 km", "distKm": 1.4, "aberto": true},
    {"nome": "Farmácia Bem Estar", "distancia": "0.8 km", "distKm": 0.8, "aberto": true},
    {"nome": "Farmácia Saúde",     "distancia": "2.1 km", "distKm": 2.1, "aberto": true},
    {"nome": "Droga Raia",         "distancia": "0.3 km", "distKm": 0.3, "aberto": false},
    {"nome": "Drogasil",           "distancia": "2.5 km", "distKm": 2.5, "aberto": false},
  ];

  List<Map<String, dynamic>> get _farmaciasFiltradas {
    return _todasFarmacias.where((f) {
      final nome = (f['nome'] as String).toLowerCase();
      final termo = _termoBusca.toLowerCase();

      final passaNome = termo.isEmpty || nome.contains(termo);

      final passaStatus = _filtroStatus == 'todos' ||
          (_filtroStatus == 'aberto' && f['aberto'] == true) ||
          (_filtroStatus == 'fechado' && f['aberto'] == false);

      return passaNome && passaStatus;
    }).toList()
      ..sort((a, b) =>
          (a['distKm'] as double).compareTo(b['distKm'] as double));
  }

  @override
  void dispose() {
    _buscaCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lista = _farmaciasFiltradas;

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

                  Row(
                    children: [
                      _chipFiltro('Todas', 'todos'),
                      const SizedBox(width: 8),
                      _chipFiltro('Abertas', 'aberto'),
                      const SizedBox(width: 8),
                      _chipFiltro('Fechadas', 'fechado'),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _termoBusca.isEmpty && _filtroStatus == 'todos'
                            ? "Farmácias Próximas"
                            : "${lista.length} resultado(s)",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: Color(0xFF436B5E),
                        ),
                      ),
                      Text(
                        'ordenado por distância',
                        style: TextStyle(
                            fontSize: 11, color: Colors.grey.shade500),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  lista.isEmpty
                      ? _semResultados()
                      : GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: lista.length,
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.85,
                            crossAxisSpacing: 15,
                            mainAxisSpacing: 15,
                          ),
                          itemBuilder: (context, index) {
                            final f = lista[index];
                            return _buildCardFarmacia(
                              f["nome"],
                              f["distancia"],
                              f["aberto"],
                            );
                          },
                        ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _chipFiltro(String label, String valor) {
    final selecionado = _filtroStatus == valor;
    return GestureDetector(
      onTap: () => setState(() => _filtroStatus = valor),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selecionado ? corVerdePrimario : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selecionado ? corVerdePrimario : Colors.grey.shade300,
          ),
          boxShadow: selecionado
              ? [
                  BoxShadow(
                    color: corVerdePrimario.withValues(alpha: 0.3),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ]
              : [],
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selecionado ? Colors.white : Colors.grey.shade600,
            fontWeight:
                selecionado ? FontWeight.bold : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  Widget _semResultados() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 40),
        child: Column(
          children: [
            Icon(Icons.store_mall_directory_outlined,
                size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            Text(
              _termoBusca.isNotEmpty
                  ? 'Nenhuma farmácia encontrada\npara "$_termoBusca"'
                  : 'Nenhuma farmácia com esse filtro',
              textAlign: TextAlign.center,
              style:
                  TextStyle(color: Colors.grey.shade500, fontSize: 15),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () {
                _buscaCtrl.clear();
                setState(() {
                  _termoBusca = '';
                  _filtroStatus = 'todos';
                });
              },
              child: const Text('Limpar filtros'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      padding:
          const EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 30),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            corVerdePrimario,
            corVerdePrimario.withValues(alpha: 0.8)
          ],
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
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.08),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                )
              ],
            ),
            child: TextField(
              controller: _buscaCtrl,
              onChanged: (v) => setState(() => _termoBusca = v.trim()),
              decoration: InputDecoration(
                hintText: "Buscar farmácias...",
                prefixIcon:
                    const Icon(Icons.search, color: Colors.grey),
                suffixIcon: _termoBusca.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.close, color: Colors.grey),
                        onPressed: () {
                          _buscaCtrl.clear();
                          setState(() => _termoBusca = '');
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardFarmacia(
      String nome, String distancia, bool estaAberto) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
              Icon(Icons.add_location_alt,
                  color: corVerdePrimario, size: 24),
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
            padding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
            decoration: BoxDecoration(
              color: estaAberto
                  ? corVerdePrimario.withValues(alpha: 0.7)
                  : Colors.grey.withValues(alpha: 0.3),
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
