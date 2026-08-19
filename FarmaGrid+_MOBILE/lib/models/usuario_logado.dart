class UsuarioLogado {
  final String token;
  final int id;
  final String email;
  final int tipo;
  final String perfil;
  final int? idMedico;
  final int? idPaciente;
  final int? idFarmacia;
  final int? idBalconista;
  final int? idCaixa;

  UsuarioLogado({
    required this.token,
    required this.id,
    required this.email,
    required this.tipo,
    required this.perfil,
    this.idMedico,
    this.idPaciente,
    this.idFarmacia,
    this.idBalconista,
    this.idCaixa,
  });

  factory UsuarioLogado.fromJson(Map<String, dynamic> json) {
    return UsuarioLogado(
      token: json['token'],
      id: json['id'],
      email: json['email'],
      tipo: json['tipo'],
      perfil: json['perfil'],
      idMedico: json['idMedico'],
      idPaciente: json['idPaciente'],
      idFarmacia: json['idFarmacia'],
      idBalconista: json['idBalconista'],
      idCaixa: json['idCaixa'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'id': id,
      'email': email,
      'tipo': tipo,
      'perfil': perfil,
      'idMedico': idMedico,
      'idPaciente': idPaciente,
      'idFarmacia': idFarmacia,
      'idBalconista': idBalconista,
      'idCaixa': idCaixa,
    };
  }
}

UsuarioLogado? usuarioLogado;
EOF
echo done