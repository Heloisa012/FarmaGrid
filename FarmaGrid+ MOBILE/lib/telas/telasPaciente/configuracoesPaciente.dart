import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:farmagridd/app_theme.dart';

class TelaConfiguracoesPaciente extends StatefulWidget {
  final int abaInicial;
  const TelaConfiguracoesPaciente({super.key, this.abaInicial = 0});

  @override
  State<TelaConfiguracoesPaciente> createState() => _TelaConfiguracoesPacienteState();
}

class _TelaConfiguracoesPacienteState extends State<TelaConfiguracoesPaciente> {
  final _themeCtrl = AppThemeController();
  int _abaSelecionada = 0;
  bool _modoEdicao = false;

  static const Map<String, String> _dadosUsuario = {
    'nome':        'Ana Carolina',
    'sobrenome':   'Lanzoni',
    'email':       'ana.lanzoni@email.com',
    'telefone':    '(11) 99999-0000',
    'nascimento':  '15/03/2000',
    'endereco':    'Av. Paulista, 1000 – São Paulo, SP',
  };

  late final TextEditingController _nomeCtrl;
  late final TextEditingController _sobrenomeCtrl;
  late final TextEditingController _emailCtrl;
  late final TextEditingController _telefoneCtrl;
  late final TextEditingController _nascimentoCtrl;
  late final TextEditingController _enderecoCtrl;
  final _planoCtrl        = TextEditingController(text: 'Unimed');
  final _carteirinhaCtrl  = TextEditingController(text: '0123456789');
  final _alergiaCtrl      = TextEditingController(text: 'Dipirona');
  final _contatoEmerCtrl  = TextEditingController(text: 'Maria Lanzoni – (11) 98888-0000');
  final _senhaAtualCtrl   = TextEditingController();
  final _novaSenhaCtrl    = TextEditingController();
  final _confirmSenhaCtrl = TextEditingController();
  final _numeroCartaoCtrl = TextEditingController();
  final _titularCtrl      = TextEditingController();
  final _validadeCtrl     = TextEditingController();

  bool _verSenhaAtual  = false;
  bool _verNovaSenha   = false;
  bool _verConfirm     = false;
  bool _notifConsultas = true;
  bool _notifReceitas  = true;
  bool _notifDescontos = false;
  bool _temaEscuro     = false;
  String _idioma        = 'Português (BR)';
  String _tipoSanguineo = 'O+';
  String _planoAssinatura = 'Plano Básico';

  final List<Map<String, String>> _dependentes = [
    {'nome': 'Maria Silva',    'parentesco': 'Cônjuge', 'cpf': '***.***.***-10'},
    {'nome': 'João Silva Jr.', 'parentesco': 'Filho',   'cpf': '***.***.***-22'},
  ];

  final List<Map<String, dynamic>> _abas = [
    {'titulo': 'Perfil pessoal', 'icone': Icons.person_outline},
    {'titulo': 'Saúde',          'icone': Icons.health_and_safety_outlined},
    {'titulo': 'Segurança',      'icone': Icons.shield_outlined},
    {'titulo': 'Preferências',   'icone': Icons.settings_outlined},
    {'titulo': 'Pagamento',      'icone': Icons.credit_card_outlined},
    {'titulo': 'Dependentes',    'icone': Icons.people_outline},
  ];

  bool get _isDark => _themeCtrl.darkMode;
  Color get _corFundo    => _isDark ? const Color(0xFF121212) : const Color(0xFFF5F5F5);
  Color get _corCard     => _isDark ? const Color(0xFF1E1E1E) : Colors.white;
  Color get _corTexto    => _isDark ? Colors.white           : const Color(0xFF2E2E2E);
  Color get _corSubtexto => _isDark ? Colors.white60         : Colors.grey;
  Color get _corBorda    => _isDark ? const Color(0xFF333333) : const Color(0xFFEEEEEE);
  Color get _corCampo    => _isDark ? const Color(0xFF2A2A2A) : const Color(0xFFF9F9F9);
  Color get _corBordaCampo => _isDark ? const Color(0xFF444444) : const Color(0xFFDDDDDD);

  static const Color _verde = Color(0xFF59AA53);
  static const Color _oliva = Color(0xFF136A48);
  static const Color _teal  = Color(0xFF7FC6BB);

  @override
  void initState() {
    super.initState();
    _abaSelecionada = widget.abaInicial;
    _temaEscuro     = _themeCtrl.darkMode;
    _themeCtrl.addListener(() => setState(() => _temaEscuro = _themeCtrl.darkMode));

    _nomeCtrl       = TextEditingController(text: _dadosUsuario['nome']);
    _sobrenomeCtrl  = TextEditingController(text: _dadosUsuario['sobrenome']);
    _emailCtrl      = TextEditingController(text: _dadosUsuario['email']);
    _telefoneCtrl   = TextEditingController(text: _dadosUsuario['telefone']);
    _nascimentoCtrl = TextEditingController(text: _dadosUsuario['nascimento']);
    _enderecoCtrl   = TextEditingController(text: _dadosUsuario['endereco']);
  }

  @override
  void dispose() {
    for (final c in [
      _nomeCtrl, _sobrenomeCtrl, _emailCtrl, _telefoneCtrl,
      _nascimentoCtrl, _enderecoCtrl, _planoCtrl, _carteirinhaCtrl,
      _alergiaCtrl, _contatoEmerCtrl, _senhaAtualCtrl, _novaSenhaCtrl,
      _confirmSenhaCtrl, _numeroCartaoCtrl, _titularCtrl, _validadeCtrl,
    ]) c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _corFundo,
      body: Column(
        children: [
          _cabecalho(context),
          _barraAbas(),
          Expanded(child: _conteudoAba()),
        ],
      ),
    );
  }

  Widget _cabecalho(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 55, left: 20, right: 20, bottom: 20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [_verde, _teal],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Configurações',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              Text('Gerencie seu perfil',
                  style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
          const Spacer(),
          CircleAvatar(
            radius: 22,
            backgroundColor: Colors.white.withValues(alpha: 0.25),
            child: const Icon(Icons.person, color: Colors.white, size: 24),
          ),
        ],
      ),
    );
  }

  Widget _barraAbas() {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: _corCard,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: ScrollConfiguration(
        behavior: _SemGlowScroll(),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          physics: const ClampingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          itemCount: _abas.length,
          itemBuilder: (_, index) => _itemAba(index),
        ),
      ),
    );
  }

  Widget _itemAba(int index) {
    final sel = _abaSelecionada == index;
    return GestureDetector(
      onTap: () => setState(() { _abaSelecionada = index; _modoEdicao = false; }),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: sel ? _verde : (_isDark ? const Color(0xFF2A2A2A) : const Color(0xFFF5F5F5)),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(_abas[index]['icone'] as IconData,
                color: sel ? Colors.white : (_isDark ? Colors.white54 : Colors.grey[500]), size: 17),
            const SizedBox(width: 7),
            Text(_abas[index]['titulo'] as String,
                style: TextStyle(
                    fontSize: 12.5,
                    color: sel ? Colors.white : (_isDark ? Colors.white60 : Colors.grey[600]),
                    fontWeight: sel ? FontWeight.bold : FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _conteudoAba() {
    switch (_abaSelecionada) {
      case 0: return _abaPerfil();
      case 1: return _abaSaude();
      case 2: return _abaSeguranca();
      case 3: return _abaPreferencias();
      case 4: return _abaPagamento();
      case 5: return _abaDependentes();
      default: return _abaPerfil();
    }
  }

  Widget _scaffoldAba({
    required String titulo,
    required String subtitulo,
    bool botaoEditar = false,
    VoidCallback? onEditar,
    VoidCallback? onSalvar,
    required Widget child,
  }) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(titulo,
                        style: TextStyle(color: _isDark ? Colors.white : _oliva, fontSize: 19, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 2),
                    Text(subtitulo, style: TextStyle(color: _corSubtexto, fontSize: 12)),
                  ],
                ),
              ),
              if (botaoEditar)
                ElevatedButton(
                  onPressed: onEditar ?? onSalvar,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _modoEdicao ? _verde : _oliva,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: Text(
                    _modoEdicao ? 'Salvar' : 'Editar',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _abaPerfil() {
    return _scaffoldAba(
      titulo: 'Perfil Pessoal',
      subtitulo: 'Suas informações pessoais cadastradas',
      botaoEditar: true,
      onEditar: () {
        if (_modoEdicao) {
          _snack('Informações salvas com sucesso!');
        }
        setState(() => _modoEdicao = !_modoEdicao);
      },
      child: Column(
        children: [
          _cardSecao(
            titulo: 'Foto de Perfil',
            subtitulo: 'Sua foto visível no sistema',
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: _teal.withValues(alpha: 0.3),
                  child: const Icon(Icons.person, color: _oliva, size: 30),
                ),
                const SizedBox(width: 16),
                OutlinedButton.icon(
                  onPressed: _modoEdicao ? () {} : null,
                  icon: Icon(Icons.camera_alt_outlined, size: 16,
                      color: _modoEdicao ? _oliva : Colors.grey),
                  label: Text('Alterar Foto',
                      style: TextStyle(
                          color: _modoEdicao ? _oliva : Colors.grey, fontSize: 13)),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: _modoEdicao ? _corBordaCampo : Colors.grey.shade300),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _cardSecao(
            titulo: 'Informações Pessoais',
            subtitulo: _modoEdicao ? 'Edite seus dados e toque em Salvar' : 'Toque em Editar para alterar',
            child: Column(
              children: [
                Row(children: [
                  Expanded(child: _campo('Nome:', _nomeCtrl, _modoEdicao)),
                  const SizedBox(width: 12),
                  Expanded(child: _campo('Sobrenome:', _sobrenomeCtrl, _modoEdicao)),
                ]),
                const SizedBox(height: 12),
                _campo('E-mail:', _emailCtrl, _modoEdicao),
                const SizedBox(height: 12),
                _campo('Telefone:', _telefoneCtrl, _modoEdicao),
                const SizedBox(height: 12),
                _campo('Data de Nascimento:', _nascimentoCtrl, _modoEdicao),
                const SizedBox(height: 12),
                _campo('Endereço:', _enderecoCtrl, _modoEdicao),
              ],
            ),
          ),
          if (_modoEdicao)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _verde.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _verde.withValues(alpha: 0.2)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.edit_outlined, color: _verde, size: 16),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text('Modo de edição ativo. Altere os campos e toque em Salvar.',
                        style: TextStyle(color: _verde, fontSize: 12)),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _abaSaude() {
    return _scaffoldAba(
      titulo: 'Informações de Saúde',
      subtitulo: 'Dados médicos e plano de saúde',
      botaoEditar: true,
      onEditar: () {
        if (_modoEdicao) _snack('Informações de saúde salvas!');
        setState(() => _modoEdicao = !_modoEdicao);
      },
      child: Column(
        children: [
          _cardSecao(
            titulo: 'Plano de Saúde',
            subtitulo: 'Informações do seu convênio médico',
            child: Column(
              children: [
                _campo('Nome do Plano:', _planoCtrl, _modoEdicao),
                const SizedBox(height: 12),
                _campo('Número da Carteirinha:', _carteirinhaCtrl, _modoEdicao),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _cardSecao(
            titulo: 'Dados Médicos',
            subtitulo: 'Informações relevantes para seus atendimentos',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Tipo Sanguíneo:',
                    style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: _tipoSanguineo,
                  style: TextStyle(color: _corTexto, fontSize: 14),
                  dropdownColor: _corCard,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: _corCampo,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: _corBordaCampo)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: _corBordaCampo)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: _verde, width: 2)),
                  ),
                  items: ['Não informado','A+','A-','B+','B-','O+','O-','AB+','AB-']
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
                  onChanged: _modoEdicao ? (v) => setState(() => _tipoSanguineo = v!) : null,
                ),
                const SizedBox(height: 12),
                _campo('Alergias conhecidas:', _alergiaCtrl, _modoEdicao),
                const SizedBox(height: 12),
                _campo('Contato de Emergência:', _contatoEmerCtrl, _modoEdicao),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _abaSeguranca() {
    return _scaffoldAba(
      titulo: 'Segurança e Privacidade',
      subtitulo: 'Gerencie sua senha e permissões de dados',
      child: Column(
        children: [
          _cardSecao(
            titulo: 'Alterar Senha',
            subtitulo: 'Mantenha sua conta segura com uma senha forte',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _campoSenha('Senha Atual:', _senhaAtualCtrl, _verSenhaAtual,
                    () => setState(() => _verSenhaAtual = !_verSenhaAtual)),
                const SizedBox(height: 12),
                _campoSenha('Nova Senha:', _novaSenhaCtrl, _verNovaSenha,
                    () => setState(() => _verNovaSenha = !_verNovaSenha)),
                const SizedBox(height: 12),
                _campoSenha('Confirmar Nova Senha:', _confirmSenhaCtrl, _verConfirm,
                    () => setState(() => _verConfirm = !_verConfirm)),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => _snack('Senha atualizada com sucesso!'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _oliva,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Atualizar Senha',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _cardSecao(
            titulo: 'Privacidade e Permissões',
            subtitulo: 'Controle como seus dados são utilizados',
            child: Column(
              children: [
                _switchItem(Icons.location_on_outlined, 'Localização',
                    'Permitir acesso à sua localização', true,
                    (v) => _snack('Localização ${v ? 'ativada' : 'desativada'}')),
                const Divider(height: 24),
                _switchItem(Icons.camera_alt_outlined, 'Câmera',
                    'Permitir acesso à câmera do dispositivo', true,
                    (v) => _snack('Câmera ${v ? 'ativada' : 'desativada'}')),
                const Divider(height: 24),
                _switchItem(Icons.share_outlined, 'Compartilhamento de dados',
                    'Permitir análise de uso para melhorias', false,
                    (v) => _snack('Compartilhamento ${v ? 'ativado' : 'desativado'}')),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _abaPreferencias() {
    return _scaffoldAba(
      titulo: 'Preferências',
      subtitulo: 'Personalize sua experiência no aplicativo',
      child: Column(
        children: [
          _cardSecao(
            titulo: 'Notificações',
            subtitulo: 'Gerencie quais alertas você deseja receber',
            child: Column(
              children: [
                _switchItem(Icons.calendar_today_outlined, 'Consultas agendadas',
                    'Lembretes das suas consultas', _notifConsultas,
                    (v) => setState(() => _notifConsultas = v)),
                const Divider(height: 24),
                _switchItem(Icons.history_edu_outlined, 'Receitas e Exames',
                    'Alertas de receitas prontas', _notifReceitas,
                    (v) => setState(() => _notifReceitas = v)),
                const Divider(height: 24),
                _switchItem(Icons.sell_outlined, 'Descontos e Promoções',
                    'Ofertas das farmácias parceiras', _notifDescontos,
                    (v) => setState(() => _notifDescontos = v)),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _cardSecao(
            titulo: 'Aparência',
            subtitulo: 'Personalize a interface do aplicativo',
            child: Column(
              children: [
                _switchItem(Icons.dark_mode_outlined, 'Tema Escuro',
                    'Alternar entre tema claro e escuro', _temaEscuro, (v) {
                  _themeCtrl.toggleTheme();
                  setState(() => _temaEscuro = v);
                }),
                const Divider(height: 24),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(9),
                      decoration: BoxDecoration(
                          color: _verde.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.language_outlined, color: _verde, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Idioma', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: _corTexto)),
                          Text('Idioma do aplicativo', style: TextStyle(color: _corSubtexto, fontSize: 12)),
                        ],
                      ),
                    ),
                    DropdownButton<String>(
                      value: _idioma,
                      underline: const SizedBox(),
                      style: TextStyle(color: _isDark ? Colors.white : _oliva, fontSize: 13),
                      dropdownColor: _corCard,
                      items: ['Português (BR)', 'English', 'Español']
                          .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                          .toList(),
                      onChanged: (v) => setState(() => _idioma = v!),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _abaPagamento() {
    return _scaffoldAba(
      titulo: 'Pagamento',
      subtitulo: 'Cartões e assinaturas do plano',
      child: Column(
        children: [
          _cardSecao(
            titulo: 'Assinatura Atual',
            subtitulo: 'Seu plano ativo e benefícios incluídos',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(colors: [_verde, _teal],
                        begin: Alignment.topLeft, end: Alignment.bottomRight),
                    borderRadius: BorderRadius.all(Radius.circular(14)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.workspace_premium, color: Colors.white, size: 28),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(_planoAssinatura,
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          const Text('Ativo · Renova em 15/07/2025',
                              style: TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                Text('Trocar plano:', style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
                const SizedBox(height: 8),
                ...['Plano Básico', 'Plano Padrão', 'Plano Premium'].map((plano) {
                  final sel = _planoAssinatura == plano;
                  return GestureDetector(
                    onTap: () => setState(() => _planoAssinatura = plano),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: sel ? _verde.withValues(alpha: 0.08) : _corCampo,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: sel ? _verde : _corBordaCampo, width: sel ? 1.5 : 1),
                      ),
                      child: Row(
                        children: [
                          Icon(sel ? Icons.radio_button_checked : Icons.radio_button_off,
                              color: sel ? _verde : Colors.grey, size: 20),
                          const SizedBox(width: 10),
                          Text(plano,
                              style: TextStyle(
                                  fontWeight: sel ? FontWeight.bold : FontWeight.normal,
                                  color: sel ? _oliva : _corTexto)),
                        ],
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _cardSecao(
            titulo: 'Cartão de Pagamento',
            subtitulo: 'Gerencie seu método de pagamento',
            child: Column(
              children: [
                _campo('Número do Cartão:', _numeroCartaoCtrl, true),
                const SizedBox(height: 12),
                _campo('Nome do Titular:', _titularCtrl, true),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _campo('Validade:', _validadeCtrl, true)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Bandeira:', style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
                          const SizedBox(height: 5),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: _corCampo,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: _corBordaCampo),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.credit_card, color: _verde, size: 18),
                                const SizedBox(width: 8),
                                Text('Visa', style: TextStyle(fontSize: 14, color: _corTexto)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => _snack('Cartão salvo com sucesso!'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _oliva,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Salvar Cartão',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _abaDependentes() {
    return _scaffoldAba(
      titulo: 'Dependentes',
      subtitulo: 'Gerencie os dependentes vinculados ao seu plano',
      child: Column(
        children: [
          _cardSecao(
            titulo: 'Dependentes Cadastrados',
            subtitulo: '${_dependentes.length} dependente(s) no plano',
            child: Column(
              children: [
                ..._dependentes.asMap().entries.map((entry) {
                  final i   = entry.key;
                  final dep = entry.value;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: _corCampo,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: _corBordaCampo),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 22,
                          backgroundColor: _verde.withValues(alpha: 0.12),
                          child: const Icon(Icons.person, color: _verde, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(dep['nome']!,
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: _corTexto)),
                              Text('${dep['parentesco']} · CPF: ${dep['cpf']}',
                                  style: TextStyle(color: _corSubtexto, fontSize: 12)),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                          onPressed: () {
                            setState(() => _dependentes.removeAt(i));
                            _snack('Dependente removido.');
                          },
                        ),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 4),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => _dialogoAdicionarDependente(),
                    icon: const Icon(Icons.person_add_outlined, color: _oliva, size: 18),
                    label: const Text('Adicionar Dependente',
                        style: TextStyle(color: _oliva, fontWeight: FontWeight.bold)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: _oliva),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          _cardSecao(
            titulo: 'Limite do Plano',
            subtitulo: 'Dependentes permitidos no seu plano atual',
            child: Row(
              children: [
                Expanded(child: _miniStat('${_dependentes.length}', 'Cadastrados', _verde)),
                const SizedBox(width: 12),
                Expanded(child: _miniStat('${3 - _dependentes.length}', 'Disponíveis', _teal)),
                const SizedBox(width: 12),
                Expanded(child: _miniStat('3', 'Máximo', _oliva)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _dialogoAdicionarDependente() {
    if (_dependentes.length >= 3) {
      _snack('Limite de 3 dependentes atingido no plano atual.');
      return;
    }

    final nomeCtrl        = TextEditingController();
    final cpfCtrl         = TextEditingController();
    final parentescoCtrl  = TextEditingController();
    String parentescoSel  = 'Filho(a)';
    const opcoes = ['Filho(a)', 'Cônjuge', 'Pai/Mãe', 'Irmão/Irmã', 'Outro'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlg) => AlertDialog(
          backgroundColor: _corCard,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: _verde.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.person_add_outlined, color: _verde, size: 22),
              ),
              const SizedBox(width: 12),
              Text('Novo Dependente', style: TextStyle(color: _corTexto, fontWeight: FontWeight.bold, fontSize: 17)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Nome completo', style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
                const SizedBox(height: 6),
                TextField(
                  controller: nomeCtrl,
                  style: TextStyle(color: _corTexto),
                  decoration: InputDecoration(
                    hintText: 'Ex: Maria da Silva',
                    hintStyle: TextStyle(color: _corSubtexto),
                    filled: true,
                    fillColor: _corCampo,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: _corBordaCampo)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: _corBordaCampo)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: _verde, width: 2)),
                  ),
                ),
                const SizedBox(height: 14),
                Text('CPF', style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
                const SizedBox(height: 6),
                TextField(
                  controller: cpfCtrl,
                  keyboardType: TextInputType.number,
                  style: TextStyle(color: _corTexto),
                  decoration: InputDecoration(
                    hintText: 'Ex: 000.000.000-00',
                    hintStyle: TextStyle(color: _corSubtexto),
                    filled: true,
                    fillColor: _corCampo,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: _corBordaCampo)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: _corBordaCampo)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: _verde, width: 2)),
                  ),
                ),
                const SizedBox(height: 14),
                Text('Parentesco', style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                  decoration: BoxDecoration(
                    color: _corCampo,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: _corBordaCampo),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: parentescoSel,
                      isExpanded: true,
                      style: TextStyle(color: _corTexto, fontSize: 14),
                      dropdownColor: _corCard,
                      items: opcoes.map((o) => DropdownMenuItem(value: o, child: Text(o))).toList(),
                      onChanged: (v) => setDlg(() => parentescoSel = v!),
                    ),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancelar', style: TextStyle(color: _corSubtexto)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: _verde,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                final nome = nomeCtrl.text.trim();
                final cpf  = cpfCtrl.text.trim();
                if (nome.isEmpty || cpf.isEmpty) {
                  _snack('Preencha nome e CPF para continuar.');
                  return;
                }
                setState(() {
                  _dependentes.add({
                    'nome':       nome,
                    'parentesco': parentescoSel,
                    'cpf':        cpf,
                  });
                });
                Navigator.pop(ctx);
                _snack('Dependente "$nome" adicionado com sucesso!');
              },
              child: const Text('Adicionar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _miniStat(String valor, String label, Color cor) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: cor.withValues(alpha: _isDark ? 0.15 : 0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(valor, style: TextStyle(color: cor, fontWeight: FontWeight.bold, fontSize: 22)),
          Text(label, style: TextStyle(color: cor.withValues(alpha: 0.7), fontSize: 11)),
        ],
      ),
    );
  }

  Widget _cardSecao({required String titulo, required String subtitulo, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: _corCard,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _corBorda),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: _isDark ? 0.2 : 0.04),
            blurRadius: 8, offset: const Offset(0, 3))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(titulo, style: TextStyle(color: _isDark ? Colors.white : _oliva, fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(subtitulo, style: TextStyle(color: _corSubtexto, fontSize: 11)),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _campo(String label, TextEditingController ctrl, bool editavel) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
        const SizedBox(height: 5),
        TextField(
          controller: ctrl,
          enabled: editavel,
          style: TextStyle(fontSize: 14, color: editavel ? _corTexto : (_isDark ? Colors.white54 : const Color(0xFF666666))),
          decoration: InputDecoration(
            filled: true,
            fillColor: editavel ? _corCampo : (_isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF0F0F0)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: _corBordaCampo)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: editavel ? _corBordaCampo : Colors.transparent)),
            disabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: _isDark ? const Color(0xFF333333) : const Color(0xFFE8E8E8))),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: _verde, width: 2)),
          ),
        ),
      ],
    );
  }

  Widget _campoSenha(String label, TextEditingController ctrl, bool visivel, VoidCallback onToggle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 13, color: _isDark ? Colors.white70 : const Color(0xFF444444))),
        const SizedBox(height: 5),
        TextField(
          controller: ctrl,
          obscureText: !visivel,
          style: TextStyle(fontSize: 14, color: _corTexto),
          decoration: InputDecoration(
            filled: true,
            fillColor: _corCampo,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            suffixIcon: IconButton(
              icon: Icon(visivel ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                  color: Colors.grey, size: 20),
              onPressed: onToggle,
            ),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: _corBordaCampo)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: _corBordaCampo)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: _verde, width: 2)),
          ),
        ),
      ],
    );
  }

  Widget _switchItem(IconData icone, String titulo, String sub,
      bool valor, ValueChanged<bool> onChange) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(9),
          decoration: BoxDecoration(
              color: _verde.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
          child: Icon(icone, color: _verde, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(titulo, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: _corTexto)),
              Text(sub, style: TextStyle(color: _corSubtexto, fontSize: 12)),
            ],
          ),
        ),
        GestureDetector(
          onTap: () => onChange(!valor),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 46, height: 26,
            decoration: BoxDecoration(
              color: valor ? _verde : Colors.grey.shade400,
              borderRadius: BorderRadius.circular(13),
            ),
            child: AnimatedAlign(
              duration: const Duration(milliseconds: 200),
              alignment: valor ? Alignment.centerRight : Alignment.centerLeft,
              child: Container(
                margin: const EdgeInsets.all(3),
                width: 20, height: 20,
                decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _snack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: _verde,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }
}

class _SemGlowScroll extends ScrollBehavior {
  @override
  Widget buildOverscrollIndicator(BuildContext context, Widget child, ScrollableDetails details) => child;

  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.stylus,
      };
}
