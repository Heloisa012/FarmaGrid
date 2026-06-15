import 'package:flutter/material.dart';

class Teleconsultas extends StatefulWidget {
  const Teleconsultas({super.key});

  @override
  State<Teleconsultas> createState() => _TeleconsultasState();
}

class _TeleconsultasState extends State<Teleconsultas> {
  static const Color _verde      = Color(0xFF59AA53);
  static const Color _oliva      = Color(0xFF136A48);
  static const Color _tealBotao  = Color(0xFF7FC6BB);
  static const Color _verdeBotao = Color(0xFF4F8946);
  static const Color _fundo      = Color(0xFFF5F5F5);

  bool _modoAgendamento = false;
  int _etapa = 1;

  String _especialidadeSel = '';
  String _medicoSel        = '';
  DateTime? _dataSel;
  String _horaSel          = '';

  final List<Map<String, dynamic>> _especialidades = [
    {'nome': 'Cardiologia',    'icone': Icons.favorite_outline},
    {'nome': 'Clínico Geral',  'icone': Icons.medical_services_outlined},
    {'nome': 'Dermatologia',   'icone': Icons.face_outlined},
    {'nome': 'Pediatria',      'icone': Icons.child_care_outlined},
    {'nome': 'Ortopedia',      'icone': Icons.accessibility_new_outlined},
    {'nome': 'Psiquiatria',    'icone': Icons.psychology_outlined},
  ];

  final List<String> _medicos = [
    'Dra. Ana Carolina Lanzoni',
    'Dr. Gabriel Andreolli Aires',
    'Dra. Heloisa Pola Argentin',
  ];

  final List<String> _horas = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

  final List<Map<String, dynamic>> _consultas = [];

  String get _dataFormatada {
    if (_dataSel == null) return '';
    final d = _dataSel!;
    final meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    final dias  = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
    return '${dias[d.weekday - 1]}, ${d.day} ${meses[d.month - 1]}';
  }

  void _confirmarAgendamento() {
    final novaConsulta = {
      'medico':       _medicoSel,
      'especialidade': _especialidadeSel,
      'data':         _dataFormatada,
      'hora':         _horaSel,
      'ativa':        false,
    };

    print('');
    print('╔══════════════════════════════════════════╗');
    print('║        CONSULTA AGENDADA COM SUCESSO     ║');
    print('╠══════════════════════════════════════════╣');
    print('║  Médico:        $_medicoSel');
    print('║  Especialidade: $_especialidadeSel');
    print('║  Data:          $_dataFormatada');
    print('║  Horário:       $_horaSel');
    print('╚══════════════════════════════════════════╝');
    print('');

    setState(() {
      _consultas.insert(0, novaConsulta);
      _modoAgendamento = false;
      _etapa            = 1;
      _especialidadeSel = '';
      _medicoSel        = '';
      _dataSel          = null;
      _horaSel          = '';
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Consulta com $_medicoSel agendada para $_dataFormatada às $_horaSel!'),
        backgroundColor: _verde,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  bool get _podeProsseguir {
    switch (_etapa) {
      case 1: return _especialidadeSel.isNotEmpty;
      case 2: return _medicoSel.isNotEmpty;
      case 3: return _dataSel != null;
      case 4: return _horaSel.isNotEmpty;
      default: return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _fundo,
      body: Column(
        children: [
          _cabecalho(),
          Expanded(child: _modoAgendamento ? _conteudoAgendamento() : _conteudoLista()),
          _rodape(),
        ],
      ),
    );
  }

  Widget _cabecalho() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.only(
        top: 50,
        bottom: _modoAgendamento ? 40 : 70,
        left: 10,
        right: 10,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [_oliva.withValues(alpha: 1.0), _verde],
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
                icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                onPressed: () {
                  if (_modoAgendamento) {
                    setState(() { _modoAgendamento = false; _etapa = 1; });
                  } else {
                    Navigator.pop(context);
                  }
                },
              ),
              Text(
                _modoAgendamento ? 'Agendar consulta' : 'Teleconsultas',
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F5F5),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _verdeBotao.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(Icons.videocam, color: _verdeBotao, size: 30),
                ),
                const SizedBox(width: 15),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Consultas Agendadas',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF436B5E))),
                    Text(
                      _consultas.isEmpty
                          ? 'Nenhuma consulta agendada'
                          : '${_consultas.length} consulta(s) agendada(s)',
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
          ),
          if (_modoAgendamento) ...[
            const SizedBox(height: 25),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _itemEtapa(1, 'Espec.'),
                _itemEtapa(2, 'Médico'),
                _itemEtapa(3, 'Data'),
                _itemEtapa(4, 'Horário'),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _itemEtapa(int n, String label) {
    final concluida = _etapa > n;
    final atual     = _etapa == n;
    return Column(
      children: [
        CircleAvatar(
          radius: 22,
          backgroundColor: atual || concluida ? Colors.white : Colors.white.withValues(alpha: 0.3),
          child: concluida
              ? Icon(Icons.check, size: 22, color: _verdeBotao)
              : Text('$n', style: TextStyle(color: atual ? _verdeBotao : Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _conteudoLista() {
    final fixas = [
      {'medico': 'Dra. Ana Carolina Lanzoni',  'especialidade': 'Clínico Geral',  'data': 'Hoje',   'hora': '15:00', 'ativa': true},
      {'medico': 'Dr. Gabriel Andreolli Aires', 'especialidade': 'Dermatologista', 'data': 'Amanhã', 'hora': '10:00', 'ativa': false},
    ];
    final todas = [..._consultas, ...fixas];

    return ListView(
      padding: const EdgeInsets.only(top: 60, left: 20, right: 20),
      children: [
        const Text('Agendadas', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.grey, fontSize: 14)),
        const SizedBox(height: 15),
        ...todas.map((c) => _cardConsulta(
          nome:         c['medico'] as String,
          especialidade: c['especialidade'] as String,
          data:         c['data'] as String,
          hora:         c['hora'] as String,
          ativa:        c['ativa'] as bool,
        )),
      ],
    );
  }

  Widget _cardConsulta({
    required String nome,
    required String especialidade,
    required String data,
    required String hora,
    required bool ativa,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: ativa ? _verde.withValues(alpha: 0.3) : Colors.black.withValues(alpha: 0.03)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: _fundo,
                radius: 24,
                child: Icon(Icons.person, color: _oliva),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(nome, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text(especialidade, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined, size: 12, color: Color(0xFF59AA53)),
                        const SizedBox(width: 4),
                        Text(data, style: const TextStyle(color: Color(0xFF59AA53), fontSize: 12, fontWeight: FontWeight.w600)),
                        const SizedBox(width: 10),
                        const Icon(Icons.access_time_outlined, size: 12, color: Color(0xFF59AA53)),
                        const SizedBox(width: 4),
                        Text(hora, style: const TextStyle(color: Color(0xFF59AA53), fontSize: 12, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: ativa ? _verde.withValues(alpha: 0.12) : _fundo,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  ativa ? 'Hoje' : 'Agendada',
                  style: TextStyle(
                    color: ativa ? _verde : Colors.grey,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          if (ativa) ...[
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.videocam, size: 18, color: Colors.white),
                label: const Text('Entrar na consulta',
                    style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _verde,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _conteudoAgendamento() {
    switch (_etapa) {
      case 1: return _gridEspecialidades();
      case 2: return _listaMedicos();
      case 3: return _calendarioData();
      case 4: return _gridHoras();
      default: return const SizedBox();
    }
  }

  Widget _gridEspecialidades() {
    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, crossAxisSpacing: 15, mainAxisSpacing: 15, childAspectRatio: 1.3),
      itemCount: _especialidades.length,
      itemBuilder: (_, i) {
        final item = _especialidades[i];
        final sel  = _especialidadeSel == item['nome'];
        return GestureDetector(
          onTap: () => setState(() => _especialidadeSel = item['nome'] as String),
          child: Container(
            decoration: BoxDecoration(
              color: sel ? _verde.withValues(alpha: 0.85) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: sel ? _verde : Colors.black.withValues(alpha: 0.05)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(item['icone'] as IconData, color: sel ? Colors.white : _verde, size: 28),
                const SizedBox(height: 10),
                Text(item['nome'] as String,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: sel ? FontWeight.bold : FontWeight.w500,
                        color: sel ? Colors.white : Colors.black87)),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _listaMedicos() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Especialidade: $_especialidadeSel',
          style: const TextStyle(color: Colors.grey, fontSize: 13),
        ),
        const SizedBox(height: 14),
        ..._medicos.map((nome) {
          final sel = _medicoSel == nome;
          return GestureDetector(
            onTap: () => setState(() => _medicoSel = nome),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: sel ? _verde : Colors.transparent),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: _fundo,
                    radius: 20,
                    child: Icon(Icons.person, color: _verdeBotao),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(nome, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                        Text(_especialidadeSel, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ),
                  if (sel) Icon(Icons.check_circle, color: _verde, size: 24),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _calendarioData() {
    final hoje     = DateTime.now();
    final mesAtual = DateTime(_dataSel?.year ?? hoje.year, _dataSel?.month ?? hoje.month);
    
    return StatefulBuilder(
      builder: (context, setLocalState) {
        int ano = mesAtual.year;
        int mes = mesAtual.month;
        
        return _CalendarioWidget(
          anoInicial:  ano,
          mesInicial:  mes,
          dataSel:     _dataSel,
          hoje:        hoje,
          onSelecionada: (d) => setState(() => _dataSel = d),
        );
      },
    );
  }

  Widget _gridHoras() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        if (_dataSel != null)
          Container(
            padding: const EdgeInsets.all(14),
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: _verde.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: _verde.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.calendar_today_outlined, color: _verde, size: 18),
                const SizedBox(width: 10),
                Text(
                  'Data selecionada: $_dataFormatada',
                  style: const TextStyle(color: _oliva, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 2.2),
          itemCount: _horas.length,
          itemBuilder: (_, i) {
            final sel = _horaSel == _horas[i];
            return GestureDetector(
              onTap: () => setState(() => _horaSel = _horas[i]),
              child: Container(
                decoration: BoxDecoration(
                  color: sel ? _verde.withValues(alpha: 0.85) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _verdeBotao.withValues(alpha: 0.2)),
                ),
                child: Center(
                  child: Text(_horas[i],
                      style: TextStyle(
                          color: sel ? Colors.white : _verdeBotao,
                          fontSize: 14,
                          fontWeight: FontWeight.bold)),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _rodape() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: _modoAgendamento
          ? Row(
              children: [
                if (_etapa > 1)
                  TextButton(
                    onPressed: () => setState(() => _etapa--),
                    child: const Text('Voltar', style: TextStyle(color: Colors.grey, fontSize: 15)),
                  ),
                const Spacer(),
                SizedBox(
                  height: 48,
                  width: 150,
                  child: ElevatedButton(
                    onPressed: _podeProsseguir
                        ? () {
                            if (_etapa < 4) {
                              setState(() => _etapa++);
                            } else {
                              _confirmarAgendamento();
                            }
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _verde,
                      disabledBackgroundColor: Colors.grey.shade300,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                    ),
                    child: Text(
                      _etapa == 4 ? 'Confirmar' : 'Próximo',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                  ),
                ),
              ],
            )
          : SizedBox(
              height: 52,
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => setState(() => _modoAgendamento = true),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: _verdeBotao, width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                ),
                child: const Text('Agendar nova consulta',
                    style: TextStyle(color: _verdeBotao, fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ),
    );
  }
}

class _CalendarioWidget extends StatefulWidget {
  final int anoInicial;
  final int mesInicial;
  final DateTime? dataSel;
  final DateTime hoje;
  final ValueChanged<DateTime> onSelecionada;

  const _CalendarioWidget({
    required this.anoInicial,
    required this.mesInicial,
    required this.dataSel,
    required this.hoje,
    required this.onSelecionada,
  });

  @override
  State<_CalendarioWidget> createState() => _CalendarioWidgetState();
}

class _CalendarioWidgetState extends State<_CalendarioWidget> {
  static const Color _verde = Color(0xFF59AA53);
  static const Color _oliva = Color(0xFF136A48);
  static const Color _fundo = Color(0xFFF5F5F5);

  late int _ano;
  late int _mes;

  final List<String> _meses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ];

  @override
  void initState() {
    super.initState();
    _ano = widget.anoInicial;
    _mes = widget.mesInicial;
  }

  void _mesAnterior() {
    setState(() {
      if (_mes == 1) { _mes = 12; _ano--; }
      else { _mes--; }
    });
  }

  void _proximoMes() {
    setState(() {
      if (_mes == 12) { _mes = 1; _ano++; }
      else { _mes++; }
    });
  }

  List<DateTime?> _diasDoMes() {
    final primeiroDia = DateTime(_ano, _mes, 1);
    final ultimoDia   = DateTime(_ano, _mes + 1, 0);
    final offset      = primeiroDia.weekday % 7;
    final List<DateTime?> dias = List<DateTime?>.generate(offset, (_) => null, growable: true);
    for (int d = 1; d <= ultimoDia.day; d++) {
      dias.add(DateTime(_ano, _mes, d));
    }
    return dias;
  }

  @override
  Widget build(BuildContext context) {
    final dias     = _diasDoMes();
    final semanas  = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Selecione a data', style: TextStyle(color: Colors.grey, fontSize: 13)),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 12, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    GestureDetector(
                      onTap: _mesAnterior,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: _fundo,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.chevron_left, color: _oliva),
                      ),
                    ),
                    Text(
                      '${_meses[_mes - 1]} $_ano',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: _oliva),
                    ),
                    GestureDetector(
                      onTap: _proximoMes,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: _fundo,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.chevron_right, color: _oliva),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: semanas.map((s) => SizedBox(
                    width: 36,
                    child: Text(s,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 12)),
                  )).toList(),
                ),
                const SizedBox(height: 8),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 7, childAspectRatio: 1),
                  itemCount: dias.length,
                  itemBuilder: (_, i) {
                    final dia = dias[i];
                    if (dia == null) return const SizedBox();

                    final ehHoje      = dia.year == widget.hoje.year &&
                                        dia.month == widget.hoje.month &&
                                        dia.day == widget.hoje.day;
                    final ehSelecionado = widget.dataSel != null &&
                                        dia.year  == widget.dataSel!.year &&
                                        dia.month == widget.dataSel!.month &&
                                        dia.day   == widget.dataSel!.day;
                    final ehPassado   = dia.isBefore(DateTime(widget.hoje.year, widget.hoje.month, widget.hoje.day));

                    return GestureDetector(
                      onTap: ehPassado ? null : () => widget.onSelecionada(dia),
                      child: Container(
                        margin: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: ehSelecionado
                              ? _verde
                              : ehHoje
                                  ? _verde.withValues(alpha: 0.12)
                                  : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            '${dia.day}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: ehSelecionado || ehHoje ? FontWeight.bold : FontWeight.normal,
                              color: ehSelecionado
                                  ? Colors.white
                                  : ehPassado
                                      ? Colors.grey.shade300
                                      : ehHoje
                                          ? _verde
                                          : const Color(0xFF2E2E2E),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          if (widget.dataSel != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: _verde.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _verde.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_outline, color: _verde, size: 20),
                  const SizedBox(width: 10),
                  Text(
                    'Selecionado: ${_nomeDia(widget.dataSel!.weekday)}, ${widget.dataSel!.day} de ${_meses[widget.dataSel!.month - 1]}',
                    style: const TextStyle(color: _oliva, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _nomeDia(int weekday) {
    const nomes = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return nomes[weekday];
  }
}
