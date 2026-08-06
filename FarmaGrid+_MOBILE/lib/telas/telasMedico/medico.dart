class Medico {
  String _crm;
  String _email;
  String _nome;
  String _senha;
  String _especialidade;
  String _clinica;
  String _telefone;
  bool   receberNotificacoes;
  bool   atendeTeleconsulta;
  bool   aceitaTermos;
  String turnoAtendimento;
  String tipoAtendimento;

  String get crm            => _crm;
  String get email          => _email;
  String get nome           => _nome;
  String get senha          => _senha;
  String get especialidade  => _especialidade;
  String get clinica        => _clinica;
  String get telefone       => _telefone;
  bool   get getNotif       => receberNotificacoes;
  bool   get getTele        => atendeTeleconsulta;
  bool   get getTermos      => aceitaTermos;
  String get getTurno       => turnoAtendimento;
  String get getTipoAten    => tipoAtendimento;

  set setCrm(String v)           => _crm = v;
  set setEmail(String v)         => _email = v;
  set setNome(String v)          => _nome = v;
  set setSenha(String v)         => _senha = v;
  set setEspecialidade(String v) => _especialidade = v;
  set setClinica(String v)       => _clinica = v;
  set setTelefone(String v)      => _telefone = v;
  set setNotif(bool v)           => receberNotificacoes = v;
  set setTele(bool v)            => atendeTeleconsulta = v;
  set setTermos(bool v)          => aceitaTermos = v;
  set setTurno(String v)         => turnoAtendimento = v;
  set setTipoAten(String v)      => tipoAtendimento = v;

  Medico(
    this._crm,
    this._email,
    this._nome,
    this._senha,
    this._especialidade,
    this._clinica,
    this._telefone,
    this.receberNotificacoes,
    this.atendeTeleconsulta,
    this.aceitaTermos,
    this.turnoAtendimento,
    this.tipoAtendimento,
  );

  @override
  String toString() =>
      'Medico[$_nome | CRM=$_crm | $_especialidade | $_clinica | '
      'turno=$turnoAtendimento | tipo=$tipoAtendimento | '
      'tele=$atendeTeleconsulta | notif=$receberNotificacoes]';
}
