int _int(dynamic value) =>
    value is num ? value.toInt() : int.tryParse('$value') ?? 0;

class ConsultaMedica {
  final int id;
  final int idMedico;
  final int idPaciente;
  final String nomePaciente;
  final String data;
  final String horario;
  final String status;
  final String duracao;
  final String tipo;

  const ConsultaMedica({
    required this.id,
    required this.idMedico,
    required this.idPaciente,
    required this.nomePaciente,
    required this.data,
    required this.horario,
    required this.status,
    required this.duracao,
    required this.tipo,
  });

  factory ConsultaMedica.fromJson(Map<String, dynamic> json) => ConsultaMedica(
    id: _int(json['id']),
    idMedico: _int(json['idMedico'] ?? json['id_medico']),
    idPaciente: _int(json['idPaciente'] ?? json['id_paciente']),
    nomePaciente: '${json['nomePaciente'] ?? json['nome_paciente'] ?? ''}',
    data: '${json['data'] ?? ''}',
    horario: '${json['horario'] ?? ''}',
    status: '${json['status'] ?? ''}',
    duracao: '${json['duracao'] ?? ''}',
    tipo: '${json['tipo'] ?? ''}',
  );
}

class PacienteMedico {
  final int id;
  final String nome;
  final String cpf;
  final int? idade;
  final List<String> condicoes;
  final int totalConsultas;
  final int totalReceitas;
  final String ultimaVisita;
  final String status;

  const PacienteMedico({
    required this.id,
    required this.nome,
    required this.cpf,
    required this.idade,
    required this.condicoes,
    required this.totalConsultas,
    required this.totalReceitas,
    required this.ultimaVisita,
    required this.status,
  });

  factory PacienteMedico.fromJson(Map<String, dynamic> json) {
    final idadeValor = json['idade'];
    return PacienteMedico(
      id: _int(json['id']),
      nome: '${json['nome'] ?? json['nomePaciente'] ?? ''}',
      cpf: '${json['cpf'] ?? ''}',
      idade: idadeValor == null ? null : _int(idadeValor),
      condicoes: (json['condicoes'] as List? ?? const [])
          .map((item) => '$item')
          .where((item) => item.isNotEmpty)
          .toList(),
      totalConsultas: _int(json['totalConsultas']),
      totalReceitas: _int(json['totalReceitas']),
      ultimaVisita: '${json['ultimaVisita'] ?? ''}',
      status: '${json['status'] ?? 'Ativo'}',
    );
  }

  String get nomeComIdade => idade == null ? nome : '$nome, $idade anos';

  String get cpfMascarado {
    final digitos = cpf.replaceAll(RegExp(r'[^0-9]'), '');
    if (digitos.length != 11) return cpf.isEmpty ? 'CPF não informado' : cpf;
    return '***.***.${digitos.substring(6, 9)}-${digitos.substring(9)}';
  }
}

class ReceitaMedica {
  final int id;
  final int idMedico;
  final int idPaciente;
  final String medicamento;
  final String concentracao;
  final String dosagem;
  final String frequencia;
  final String duracao;
  final String viaAdministracao;
  final String instrucoes;
  final String observacoes;
  final String dataPrescricao;
  final String status;

  const ReceitaMedica({
    this.id = 0,
    required this.idMedico,
    required this.idPaciente,
    required this.medicamento,
    this.concentracao = '',
    required this.dosagem,
    this.frequencia = '',
    required this.duracao,
    this.viaAdministracao = 'Oral',
    this.instrucoes = '',
    this.observacoes = '',
    this.dataPrescricao = '',
    this.status = 'Ativa',
  });

  Map<String, dynamic> toJson() => {
    'idMedico': idMedico,
    'idPaciente': idPaciente,
    'medicamento': medicamento,
    'concentracao': concentracao,
    'dosagem': dosagem,
    'frequencia': frequencia,
    'duracao': duracao,
    'viaAdministracao': viaAdministracao,
    'instrucoes': instrucoes,
    'observacoes': observacoes,
    'dataPrescricao': dataPrescricao,
    'status': status,
  };
}
