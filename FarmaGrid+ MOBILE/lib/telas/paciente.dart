
class Paciente {
  String _email;
  String _senha;
  String _nome;
  String _telefone;
  bool receberNotificacoes;
  bool possuiPlanoSaude;
  bool aceitaTermos;
  String tipoSanguineo;
  String genero;

  String get email        => _email;
  String get senha        => _senha;
  String get nome         => _nome;
  String get telefone     => _telefone;
  bool   get getNotif     => receberNotificacoes;
  bool   get getPlano     => possuiPlanoSaude;
  bool   get getTermos    => aceitaTermos;
  String get getTipo      => tipoSanguineo;
  String get getGenero    => genero;

  set setEmail(String v)    => _email = v;
  set setSenha(String v)    => _senha = v;
  set setNome(String v)     => _nome = v;
  set setTelefone(String v) => _telefone = v;
  set setNotif(bool v)      => receberNotificacoes = v;
  set setPlano(bool v)      => possuiPlanoSaude = v;
  set setTermos(bool v)     => aceitaTermos = v;
  set setTipo(String v)     => tipoSanguineo = v;
  set setGenero(String v)   => genero = v;

  Paciente(
    this._email,
    this._senha,
    this._nome,
    this._telefone,
    this.receberNotificacoes,
    this.possuiPlanoSaude,
    this.aceitaTermos,
    this.tipoSanguineo,
    this.genero,
  );

  @override
  String toString() =>
      'Paciente[$_nome | $_email | tipo=$tipoSanguineo | genero=$genero | '
      'notif=$receberNotificacoes | plano=$possuiPlanoSaude]';
}
