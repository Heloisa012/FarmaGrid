import '../models/medico_models.dart';
import '../models/paciente_models.dart';
import 'api_service.dart';
import 'auth_service.dart';

class PacienteService {
  static int get idPaciente {
    final id = AuthService.usuarioLogado?.idPaciente;
    if (id == null) {
      throw ApiException('Sessão de paciente inválida. Faça login novamente.');
    }
    return id;
  }

  static Future<PacientePerfil> buscarPerfil() async => PacientePerfil.fromJson(
    await ApiService.getMap('/api/pacientes/$idPaciente/config'),
  );

  static Future<List<ConsultaMedica>> listarConsultas() async =>
      (await ApiService.getList(
        '/api/teleconsultas/paciente/$idPaciente',
      )).map(ConsultaMedica.fromJson).toList();

  static Future<List<ReceitaPaciente>> listarReceitas() async =>
      (await ApiService.getList(
        '/api/receitas/paciente/$idPaciente',
      )).map(ReceitaPaciente.fromJson).toList();

  static Future<List<ProntuarioPaciente>> listarProntuarios() async =>
      (await ApiService.getList(
        '/api/prontuarios/paciente/$idPaciente',
      )).map(ProntuarioPaciente.fromJson).toList();

  static Future<List<ProdutoPaciente>> listarProdutos() async =>
      (await ApiService.getList(
        '/api/produtos',
      )).map(ProdutoPaciente.fromJson).toList();

  static Future<List<CupomPaciente>> listarCupons() async {
    List<Map<String, dynamic>> cuponsPaciente = const [];
    try {
      cuponsPaciente = await ApiService.getList(
        '/api/pacientes/$idPaciente/cupons',
      );
    } on ApiException {
      // A API publicada pode ainda não possuir o endpoint específico do paciente.
    }
    if (cuponsPaciente.isNotEmpty) {
      return cuponsPaciente.map(CupomPaciente.fromJson).toList();
    }

    // O desktop lista por farmácia. Este fallback usa exatamente os mesmos
    // endpoints para também contemplar APIs publicadas antes do endpoint do paciente.
    final farmacias = await ApiService.getList('/api/farmacias');
    final listas = await Future.wait(
      farmacias.map((farmacia) {
        final id = farmacia['id'];
        if (id == null) return Future.value(<Map<String, dynamic>>[]);
        return ApiService.getList('/api/cupons?idFarmacia=$id');
      }),
    );

    final hoje = DateTime.now();
    final unicos = <int, CupomPaciente>{};
    for (final json in listas.expand((lista) => lista)) {
      final status = '${json['status'] ?? 'ativo'}'.toLowerCase();
      final validade = DateTime.tryParse('${json['validade'] ?? ''}');
      final limite = int.tryParse('${json['limiteUso'] ?? 0}') ?? 0;
      final usos = int.tryParse('${json['usosAtuais'] ?? 0}') ?? 0;
      final validoNaData =
          validade == null ||
          !validade.isBefore(DateTime(hoje.year, hoje.month, hoje.day));
      final temUso = limite <= 0 || usos < limite;
      if ((status == 'ativo' || status.isEmpty) && validoNaData && temUso) {
        final cupom = CupomPaciente.fromJson({...json, 'resgatado': false});
        unicos[cupom.id] = cupom;
      }
    }
    return unicos.values.toList();
  }

  static Future<CupomPaciente> resgatarCupom(int idCupom) async =>
      CupomPaciente.fromJson(
        await ApiService.post(
          '/api/pacientes/$idPaciente/cupons/$idCupom/resgatar',
          const {},
        ),
      );

  static Future<List<Map<String, dynamic>>> listarDependentes() =>
      ApiService.getList('/api/pacientes/$idPaciente/dependentes');
  static Future<List<Map<String, dynamic>>> listarAlergias() =>
      ApiService.getList('/api/pacientes/$idPaciente/alergias');
  static Future<List<Map<String, dynamic>>> listarCartoes() =>
      ApiService.getList('/api/pacientes/$idPaciente/cartoes');
  static Future<List<Map<String, dynamic>>> listarExames() =>
      ApiService.getList('/api/relatorios/paciente/$idPaciente');
  static Future<List<Map<String, dynamic>>> listarSolicitacoesExame() =>
      ApiService.getList('/api/solicitacoes-exame/paciente/$idPaciente');
  static Future<Map<String, dynamic>> solicitarExame(
    String exame,
    String justificativa,
  ) => ApiService.post('/api/solicitacoes-exame', {
    'idPaciente': idPaciente,
    'exame': exame,
    'justificativa': justificativa,
  });
  static Future<List<Map<String, dynamic>>> listarMedicos() =>
      ApiService.getList('/api/medicos-disponiveis');
  static Future<Map<String, dynamic>> agendarTeleconsulta(
    Map<String, dynamic> dados,
  ) => ApiService.post('/api/teleconsultas', {
    ...dados,
    'idPaciente': idPaciente,
  });
  static Future<List<Map<String, dynamic>>> listarFarmaciasProximas() =>
      ApiService.getList('/api/pacientes/$idPaciente/farmacias-proximas');
  static Future<void> alterarAssinatura(
    bool premium, {
    String tipo = 'MENSAL',
  }) => ApiService.put('/api/pacientes/$idPaciente/assinatura', {
    'premium': premium,
    'tipo': tipo,
  });

  static Future<void> atualizarPerfil(Map<String, dynamic> dados) async =>
      ApiService.put('/api/pacientes/$idPaciente', dados);
  static Future<void> adicionarDependente(Map<String, dynamic> dados) async =>
      ApiService.post('/api/dependentes', {...dados, 'idPaciente': idPaciente});
  static Future<void> removerDependente(int id) =>
      ApiService.delete('/api/dependentes/$id');
  static Future<void> adicionarCartao(Map<String, dynamic> dados) async =>
      ApiService.post('/api/cartoes', {...dados, 'idPaciente': idPaciente});
  static Future<void> removerCartao(int id) =>
      ApiService.delete('/api/cartoes/$id');
}
