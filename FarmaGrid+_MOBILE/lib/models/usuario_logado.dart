class UsuarioLogado {
  final String token;
  final int id;
  final String email;
  final String tipo;
  final String nome;
  final int? idPaciente;
  final int? idMedico;

  UsuarioLogado({
    required this.token,
    required this.id,
    required this.email,
    required this.tipo,
    required this.nome,
    this.idPaciente,
    this.idMedico,
  });

  factory UsuarioLogado.fromLoginEMe({
    required String token,
    required Map<String, dynamic> me,
  }) {
    return UsuarioLogado(
      token: token,
      id: me['id'],
      email: me['email'],
      tipo: me['tipo'],
      nome: me['nome'],
      idPaciente: me['idPaciente'],
      idMedico: me['idMedico'],
    );
  }
}

UsuarioLogado? usuarioLogado;