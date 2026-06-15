import 'package:farmagridd/telas/telasPaciente/descontos.dart';
import 'package:flutter/material.dart';

class TelaMedicamentos extends StatefulWidget {
  const TelaMedicamentos({super.key});

  @override
  State<TelaMedicamentos> createState() => _TelaMedicamentosState();
}

class _TelaMedicamentosState extends State<TelaMedicamentos> {
  static const Color _verde = Color(0xFF59AA53);
  static const Color _fundo = Color(0xFFF5F5F5);
  static const Color _teal  = Color(0xFF7FC6BB);
  static const Color _teal2 = Color(0xFF629991);

  final TextEditingController _buscaCtrl = TextEditingController();
  String _termoBusca = '';

  static const List<Map<String, dynamic>> _todosMedicamentos = [
    {
      'nome': 'Paracetamol 750mg',
      'categoria': 'Analgésico',
      'precoOriginal': 'R\$ 18,90',
      'precoFinal': 'R\$ 12,90',
      'desconto': '-30%',
      'avaliacao': '4.8',
      'distancia': '1.3 km',
    },
    {
      'nome': 'Ibuprofeno 600mg',
      'categoria': 'Anti-inflamatório',
      'precoOriginal': 'R\$ 24,50',
      'precoFinal': 'R\$ 17,90',
      'desconto': '-27%',
      'avaliacao': '4.6',
      'distancia': '0.8 km',
    },
    {
      'nome': 'Amoxicilina 500mg',
      'categoria': 'Antibiótico',
      'precoOriginal': 'R\$ 38,00',
      'precoFinal': 'R\$ 29,90',
      'desconto': '-21%',
      'avaliacao': '4.7',
      'distancia': '2.1 km',
    },
    {
      'nome': 'Losartana 50mg',
      'categoria': 'Anti-hipertensivo',
      'precoOriginal': 'R\$ 32,00',
      'precoFinal': 'R\$ 22,90',
      'desconto': '-28%',
      'avaliacao': '4.9',
      'distancia': '1.5 km',
    },
    {
      'nome': 'Omeprazol 20mg',
      'categoria': 'Antiulceroso',
      'precoOriginal': 'R\$ 28,00',
      'precoFinal': 'R\$ 19,90',
      'desconto': '-29%',
      'avaliacao': '4.5',
      'distancia': '0.5 km',
    },
    {
      'nome': 'Metformina 850mg',
      'categoria': 'Antidiabético',
      'precoOriginal': 'R\$ 21,00',
      'precoFinal': 'R\$ 14,90',
      'desconto': '-29%',
      'avaliacao': '4.7',
      'distancia': '3.0 km',
    },
    {
      'nome': 'Dipirona 500mg',
      'categoria': 'Analgésico',
      'precoOriginal': 'R\$ 14,00',
      'precoFinal': 'R\$ 9,90',
      'desconto': '-29%',
      'avaliacao': '4.6',
      'distancia': '1.0 km',
    },
    {
      'nome': 'Atorvastatina 20mg',
      'categoria': 'Hipolipemiante',
      'precoOriginal': 'R\$ 45,00',
      'precoFinal': 'R\$ 32,90',
      'desconto': '-27%',
      'avaliacao': '4.8',
      'distancia': '2.5 km',
    },
  ];

  List<Map<String, dynamic>> get _medicamentosFiltrados {
    if (_termoBusca.isEmpty) return _todosMedicamentos;
    final termo = _termoBusca.toLowerCase();
    return _todosMedicamentos
        .where((m) =>
            (m['nome'] as String).toLowerCase().contains(termo) ||
            (m['categoria'] as String).toLowerCase().contains(termo))
        .toList();
  }

  @override
  void dispose() {
    _buscaCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lista = _medicamentosFiltrados;
    return Scaffold(
      backgroundColor: _fundo,
      body: Column(
        children: [
          _cabecalho(),
          Expanded(
            child: lista.isEmpty
                ? _semResultados()
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _termoBusca.isEmpty
                                  ? "Melhores Ofertas"
                                  : "${lista.length} resultado(s)",
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                            if (_termoBusca.isEmpty)
                              GestureDetector(
                                onTap: () => Navigator.push(context,
                                    MaterialPageRoute(
                                        builder: (_) => const TelaDescontos())),
                                child: Text(
                                  "Ver descontos",
                                  style: TextStyle(
                                    color: _verde,
                                    fontWeight: FontWeight.w500,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.68,
                            crossAxisSpacing: 15,
                            mainAxisSpacing: 15,
                          ),
                          itemCount: lista.length,
                          itemBuilder: (_, i) => _cardMedicamento(lista[i]),
                        ),
                      ],
                    ),
                  ),
          ),
          _botaoCarrinho(),
        ],
      ),
    );
  }

  Widget _cabecalho() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [_teal, _teal.withValues(alpha: 0.8)],
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(35),
          bottomRight: Radius.circular(35),
        ),
      ),
      padding: const EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 20),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
              const Text(
                "Medicamentos",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _buscaCtrl,
            onChanged: (v) => setState(() => _termoBusca = v.trim()),
            decoration: InputDecoration(
              hintText: "Buscar medicamentos...",
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _termoBusca.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () {
                        _buscaCtrl.clear();
                        setState(() => _termoBusca = '');
                      },
                    )
                  : null,
              fillColor: Colors.white,
              filled: true,
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(25),
                  borderSide: BorderSide.none),
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
            ),
          ),
        ],
      ),
    );
  }

  Widget _semResultados() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, size: 60, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          Text(
            "Nenhum resultado para\n\"$_termoBusca\"",
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade500, fontSize: 16),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () {
              _buscaCtrl.clear();
              setState(() => _termoBusca = '');
            },
            child: const Text("Limpar busca"),
          ),
        ],
      ),
    );
  }

  Widget _cardMedicamento(Map<String, dynamic> med) {
    return Container(
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                child: Container(
                  height: 100,
                  width: double.infinity,
                  color: _teal.withValues(alpha: 0.12),
                  child: const Icon(Icons.medical_services_outlined,
                      size: 48, color: Color(0xFF629991)),
                ),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                      color: _teal2, borderRadius: BorderRadius.circular(10)),
                  child: Text(med['desconto'],
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(med['nome'],
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 13),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                const SizedBox(height: 2),
                Text(med['categoria'],
                    style: TextStyle(
                        color: Colors.grey.shade500, fontSize: 11)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star,
                        color: Color(0xFFF3CD23), size: 14),
                    const SizedBox(width: 4),
                    Text(med['avaliacao'],
                        style: const TextStyle(
                            color: Color(0xFF36515F), fontSize: 12)),
                    const SizedBox(width: 8),
                    const Icon(Icons.location_on,
                        color: Color(0xFF36515F), size: 14),
                    const SizedBox(width: 2),
                    Text(med['distancia'],
                        style: const TextStyle(
                            color: Color(0xFF36515F), fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(med['precoOriginal'],
                    style: const TextStyle(
                        decoration: TextDecoration.lineThrough,
                        fontSize: 11,
                        color: Colors.grey)),
                Text(med['precoFinal'],
                    style: const TextStyle(
                        color: _teal2,
                        fontWeight: FontWeight.bold,
                        fontSize: 15)),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(color: _teal2, shape: BoxShape.circle),
                    child: const Icon(Icons.add_shopping_cart,
                        color: Colors.white, size: 18),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _botaoCarrinho() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, -4))
          ]),
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: _teal,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        ),
        onPressed: () {},
        icon: const Icon(Icons.shopping_cart, color: Colors.white),
        label: const Text("Ver Carrinho",
            style: TextStyle(
                color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
      ),
    );
  }
}
