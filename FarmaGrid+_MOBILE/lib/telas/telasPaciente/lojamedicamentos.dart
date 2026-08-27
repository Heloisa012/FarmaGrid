import 'package:farmagrid/telas/telasPaciente/descontos.dart';
import 'package:flutter/material.dart';
import '../../services/paciente_service.dart';

class ItemCarrinho {
  final Map<String, dynamic> medicamento;
  int quantidade;

  ItemCarrinho({required this.medicamento, this.quantidade = 1});
}

class TelaCarrinho extends StatefulWidget {
  final List<ItemCarrinho> itens;
  final VoidCallback onAtualizar;

  const TelaCarrinho({
    super.key,
    required this.itens,
    required this.onAtualizar,
  });

  @override
  State<TelaCarrinho> createState() => _TelaCarrinhoState();
}

class _TelaCarrinhoState extends State<TelaCarrinho> {
  static const Color _teal = Color(0xFF7FC6BB);
  static const Color _teal2 = Color(0xFF629991);

  double get _total {
    return widget.itens.fold(0.0, (soma, item) {
      final preco = item.medicamento['precoFinal'] as String;
      final valor =
          double.tryParse(preco.replaceAll('R\$ ', '').replaceAll(',', '.')) ??
          0.0;
      return soma + valor * item.quantidade;
    });
  }

  void _alterar(ItemCarrinho item, int delta) {
    setState(() {
      item.quantidade += delta;
      if (item.quantidade <= 0) {
        widget.itens.remove(item);
      }
    });
    widget.onAtualizar();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: _teal,
        title: const Text(
          'Meu Carrinho',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        elevation: 0,
      ),
      body: widget.itens.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.shopping_cart_outlined,
                    size: 80,
                    color: Colors.grey.shade300,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Carrinho vazio',
                    style: TextStyle(fontSize: 18, color: Colors.grey.shade500),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Adicione medicamentos para continuar',
                    style: TextStyle(color: Colors.grey.shade400),
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: widget.itens.length,
                    itemBuilder: (_, i) {
                      final item = widget.itens[i];
                      final med = item.medicamento;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.05),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color: _teal.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.medical_services_outlined,
                                color: _teal2,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    med['nome'],
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    med['categoria'],
                                    style: TextStyle(
                                      color: Colors.grey.shade500,
                                      fontSize: 11,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    med['precoFinal'],
                                    style: const TextStyle(
                                      color: _teal2,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                _btnQtd(Icons.remove, () => _alterar(item, -1)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                  ),
                                  child: Text(
                                    '${item.quantidade}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                                _btnQtd(Icons.add, () => _alterar(item, 1)),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 12,
                        offset: const Offset(0, -4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            'R\$ ${_total.toStringAsFixed(2).replaceAll('.', ',')}',
                            style: const TextStyle(
                              color: _teal2,
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _teal,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                        ),
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (_) => AlertDialog(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                              title: const Text('Pedido Confirmado! 🎉'),
                              content: const Text(
                                'Seu pedido foi realizado com sucesso. Em breve você receberá a confirmação.',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    setState(() => widget.itens.clear());
                                    widget.onAtualizar();
                                    Navigator.pop(context);
                                  },
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          );
                        },
                        child: const Text(
                          'Finalizar Pedido',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _btnQtd(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: _teal.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, size: 16, color: _teal2),
      ),
    );
  }
}

class TelaMedicamentos extends StatefulWidget {
  const TelaMedicamentos({super.key});

  @override
  State<TelaMedicamentos> createState() => _TelaMedicamentosState();
}

class _TelaMedicamentosState extends State<TelaMedicamentos> {
  static const Color _verde = Color(0xFF59AA53);
  static const Color _fundo = Color(0xFFF5F5F5);
  static const Color _teal = Color(0xFF7FC6BB);
  static const Color _teal2 = Color(0xFF629991);

  final TextEditingController _buscaCtrl = TextEditingController();
  String _termoBusca = '';

  final List<ItemCarrinho> _carrinho = [];
  List<Map<String, dynamic>> _produtosApi = const [];

  @override
  void initState() {
    super.initState();
    _carregarProdutos();
  }

  Future<void> _carregarProdutos() async {
    try {
      final produtos = await PacienteService.listarProdutos();
      if (!mounted) return;
      setState(
        () => _produtosApi = produtos
            .where((p) => p.quantidade > 0)
            .map(
              (p) => {
                'id': p.id,
                'nome': p.nome,
                'categoria': p.categoria,
                'precoOriginal':
                    'R\$ ${p.preco.toStringAsFixed(2).replaceAll('.', ',')}',
                'precoFinal':
                    'R\$ ${p.preco.toStringAsFixed(2).replaceAll('.', ',')}',
                'desconto': p.controlado ? 'Receita' : '',
                'avaliacao': '—',
                'distancia': 'Estoque: ${p.quantidade}',
              },
            )
            .toList(),
      );
    } catch (_) {}
  }

  int get _totalItens =>
      _carrinho.fold(0, (soma, item) => soma + item.quantidade);

  void _adicionarAoCarrinho(Map<String, dynamic> med) {
    setState(() {
      final existente = _carrinho
          .where((i) => i.medicamento['nome'] == med['nome'])
          .firstOrNull;
      if (existente != null) {
        existente.quantidade++;
      } else {
        _carrinho.add(ItemCarrinho(medicamento: med));
      }
    });

    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                '${med['nome']} adicionado ao carrinho',
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        backgroundColor: _teal2,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  static const List<Map<String, dynamic>> _fallbackMedicamentos = [
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
    final todosMedicamentos = _produtosApi.isEmpty
        ? _fallbackMedicamentos
        : _produtosApi;
    if (_termoBusca.isEmpty) return todosMedicamentos;
    final termo = _termoBusca.toLowerCase();
    return todosMedicamentos
        .where(
          (m) =>
              (m['nome'] as String).toLowerCase().contains(termo) ||
              (m['categoria'] as String).toLowerCase().contains(termo),
        )
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
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            if (_termoBusca.isEmpty)
                              GestureDetector(
                                onTap: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const TelaDescontos(),
                                  ),
                                ),
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
                  fontWeight: FontWeight.bold,
                ),
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
                borderSide: BorderSide.none,
              ),
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
    final noCarrinho = _carrinho
        .where((i) => i.medicamento['nome'] == med['nome'])
        .firstOrNull;
    final qtdNoCarrinho = noCarrinho?.quantidade ?? 0;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(20),
                ),
                child: Container(
                  height: 100,
                  width: double.infinity,
                  color: _teal.withValues(alpha: 0.12),
                  child: const Icon(
                    Icons.medical_services_outlined,
                    size: 48,
                    color: Color(0xFF629991),
                  ),
                ),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _teal2,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    med['desconto'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  med['nome'],
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  med['categoria'],
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star, color: Color(0xFFF3CD23), size: 14),
                    const SizedBox(width: 4),
                    Text(
                      med['avaliacao'],
                      style: const TextStyle(
                        color: Color(0xFF36515F),
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(
                      Icons.location_on,
                      color: Color(0xFF36515F),
                      size: 14,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      med['distancia'],
                      style: const TextStyle(
                        color: Color(0xFF36515F),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  med['precoOriginal'],
                  style: const TextStyle(
                    decoration: TextDecoration.lineThrough,
                    fontSize: 11,
                    color: Colors.grey,
                  ),
                ),
                Text(
                  med['precoFinal'],
                  style: const TextStyle(
                    color: _teal2,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 8),

                Align(
                  alignment: Alignment.centerRight,
                  child: qtdNoCarrinho == 0
                      ? GestureDetector(
                          onTap: () => _adicionarAoCarrinho(med),
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: _teal2,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.add_shopping_cart,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        )
                      : Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  if (noCarrinho!.quantidade > 1) {
                                    noCarrinho.quantidade--;
                                  } else {
                                    _carrinho.remove(noCarrinho);
                                  }
                                });
                              },
                              child: Container(
                                width: 26,
                                height: 26,
                                decoration: BoxDecoration(
                                  color: _teal.withValues(alpha: 0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.remove,
                                  size: 14,
                                  color: _teal2,
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                              ),
                              child: Text(
                                '$qtdNoCarrinho',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: _teal2,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            GestureDetector(
                              onTap: () => _adicionarAoCarrinho(med),
                              child: Container(
                                width: 26,
                                height: 26,
                                decoration: const BoxDecoration(
                                  color: _teal2,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.add,
                                  size: 14,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
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
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: _teal,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => TelaCarrinho(
                itens: _carrinho,
                onAtualizar: () => setState(() {}),
              ),
            ),
          );
        },
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.shopping_cart, color: Colors.white),
                if (_totalItens > 0)
                  Positioned(
                    right: -8,
                    top: -8,
                    child: Container(
                      width: 18,
                      height: 18,
                      decoration: const BoxDecoration(
                        color: Colors.redAccent,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          '$_totalItens',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 12),
            const Text(
              "Ver Carrinho",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
