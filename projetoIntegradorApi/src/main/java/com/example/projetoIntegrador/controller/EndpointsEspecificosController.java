package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.dto.*;
import com.example.projetoIntegrador.model.*;
import com.example.projetoIntegrador.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EndpointsEspecificosController {

    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private TeleconsultaRepository teleconsultaRepo;
    @Autowired private ReceitaRepository receitaRepo;
    @Autowired private CupomRepository cupomRepo;
    @Autowired private ProdutoRepository produtoRepo;
    @Autowired private LoteRepository loteRepo;
    @Autowired private FuncionarioRepository funcionarioRepo;
    @Autowired private ConsultaRepository consultaRepo;
    @Autowired private MedicoRepository medicoRepo;
    @Autowired private MedicoClinicaRepository medicoClinicaRepo;
    @Autowired private RelatorioRepository relatorioRepo;
    @Autowired private RelatorioFarmaciaRepository relatorioFarmaciaRepo;
    @Autowired private DependenteRepository dependenteRepo;
    @Autowired private PacienteAlergiaRepository pacienteAlergiaRepo;
    @Autowired private CartaoRepository cartaoRepo;
    @Autowired private DisponibilidadeMedicoRepository disponibilidadeMedicoRepo;

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE — busca por nome
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/pacientes/buscar")
    public List<Paciente> buscarPorNome(@RequestParam String nome) {
        return pacienteRepo.findByNomeContainingIgnoreCase(nome);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // TELECONSULTA — por médico (ordenada) e por paciente
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/teleconsultas/medico/{idMedico}")
    public List<Teleconsulta> consultasPorMedico(@PathVariable Long idMedico) {
        return teleconsultaRepo.findByIdMedicoOrderByData(idMedico);
    }

    @GetMapping("/teleconsultas/paciente/{idPaciente}")
    public List<Teleconsulta> consultasPorPaciente(@PathVariable Long idPaciente) {
        return teleconsultaRepo.findByIdPaciente(idPaciente);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // RECEITA — por paciente
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/receitas/paciente/{idPaciente}")
    public List<Receita> receitasPorPaciente(@PathVariable Long idPaciente) {
        return receitaRepo.findByIdPaciente(idPaciente);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CUPOM — lista com expiração automática (mesma regra do main.js)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/cupons")
    @Transactional
    public List<Cupom> listarCupons() {
        LocalDate hoje = LocalDate.now();
        for (Cupom c : cupomRepo.findByStatus("ativo")) {
            boolean expiradoPorData = c.getValidade() != null && c.getValidade().isBefore(hoje);
            boolean expiradoPorUso = c.getLimiteUso() != null && c.getLimiteUso() > 0
                    && c.getUsosAtuais() != null && c.getUsosAtuais() >= c.getLimiteUso();
            if (expiradoPorData || expiradoPorUso) {
                c.setStatus("expirado");
                cupomRepo.save(c);
            }
        }
        return cupomRepo.findAllOrderByStatusAndCodigo();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // FUNCIONÁRIO — atualizar status
    // ──────────────────────────────────────────────────────────────────────────
    @PatchMapping("/funcionarios/{cpf}/status")
    public ResponseEntity<?> atualizarStatusFuncionario(@PathVariable String cpf, @RequestBody StatusRequest req) {
        Funcionario func = funcionarioRepo.findById(cpf).orElse(null);
        if (func == null) return ResponseEntity.notFound().build();
        func.setStatus(req.status);
        funcionarioRepo.save(func);
        return ResponseEntity.ok().build();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PRODUTO — lista enriquecida (próxima validade + total em lotes) e estoque baixo
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/produtos")
    public List<Produto> listarProdutos() {
        List<Produto> produtos = produtoRepo.findAllByOrderByNomeAsc();
        for (Produto p : produtos) {
            p.setProximaValidade(loteRepo.proximaValidade(p.getId()));
            p.setTotalLotes(loteRepo.totalLotes(p.getId()));
        }
        return produtos;
    }

    @GetMapping("/produtos/estoque-baixo")
    public List<Produto> produtosEstoqueBaixo() {
        return produtoRepo.findEstoqueBaixo();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // LOTE — todos (com nome do produto), por produto, criação (entrada/saída) e remoção
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/lotes")
    public List<LoteComProdutoResponse> listarLotes() {
        return loteRepo.findAllByOrderByDataValidadeAsc().stream()
                .map(this::comNomeProduto)
                .collect(Collectors.toList());
    }

    @GetMapping("/lotes/produto/{idProduto}")
    public List<Lote> lotesPorProduto(@PathVariable Long idProduto) {
        return loteRepo.findByIdProdutoOrderByDataValidadeAsc(idProduto);
    }

    private LoteComProdutoResponse comNomeProduto(Lote l) {
        LoteComProdutoResponse r = new LoteComProdutoResponse();
        r.id = l.getId();
        r.idProduto = l.getIdProduto();
        r.numeroLote = l.getNumeroLote();
        r.quantidade = l.getQuantidade();
        r.dataValidade = l.getDataValidade();
        r.prateleira = l.getPrateleira();
        r.nomeProduto = produtoRepo.findById(l.getIdProduto()).map(Produto::getNome).orElse(null);
        return r;
    }

    @PostMapping("/lotes")
    @Transactional
    public ResponseEntity<?> atualizarEstoque(@RequestBody AtualizarEstoqueRequest req) {
        Produto produto = produtoRepo.findById(req.idProduto).orElse(null);
        if (produto == null) return ResponseEntity.notFound().build();

        int qtd = "entrada".equals(req.tipo) ? req.quantidade : -req.quantidade;
        produto.setQuantidade(produto.getQuantidade() + qtd);
        produtoRepo.save(produto);

        if (req.numeroLote != null || req.dataValidade != null) {
            Lote lote = new Lote();
            lote.setIdProduto(req.idProduto);
            lote.setNumeroLote(req.numeroLote);
            lote.setQuantidade(req.quantidade);
            lote.setDataValidade(req.dataValidade);
            lote.setPrateleira(req.prateleira);
            loteRepo.save(lote);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/lotes/{id}")
    public void removerLote(@PathVariable Long id) {
        loteRepo.deleteById(id);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CONSULTA — reagendar (atualiza só data/horário/duração, sem mexer no paciente)
    // ──────────────────────────────────────────────────────────────────────────
    @PatchMapping("/consultas/{id}/reagendar")
    public ResponseEntity<?> reagendarConsulta(@PathVariable Integer id, @RequestBody ReagendarConsultaRequest req) {
        Consulta consulta = consultaRepo.findById(id).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();
        consulta.setData(req.novaData);
        consulta.setHorario(req.novoHorario);
        consulta.setDuracao(req.novaDuracao);
        consultaRepo.save(consulta);
        return ResponseEntity.ok().build();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // MÉDICO — configurações (dados + clínica + preferências + foto)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/medicos/{id}/config")
    public ResponseEntity<MedicoConfigResponse> buscarConfigMedico(@PathVariable Long id) {
        Medico m = medicoRepo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();

        MedicoConfigResponse r = new MedicoConfigResponse();
        r.id = m.getId();
        r.nome = m.getNome();
        r.sobrenome = m.getSobrenome();
        r.crm = m.getCrm();
        r.especialidade = m.getEspecialidade();
        r.email = m.getEmail();
        r.telefone = m.getTelefone();
        r.dataNascimento = m.getDataNascimento();
        r.endereco = m.getEndereco();
        r.fotoPerfil = m.getFotoPerfil();
        r.rqe = m.getRqe();
        r.subespecialidades = m.getSubespecialidades();
        r.horarioInicio = m.getHorarioInicio();
        r.horarioTermino = m.getHorarioTermino();
        r.tipoAtendimento = m.getTipoAtendimento();

        medicoClinicaRepo.findByIdMedico(id).ifPresent(mc -> {
            r.nomeClinica = mc.getNomeClinica();
            r.enderecoClinica = mc.getEnderecoClinica();
            r.tempoConsulta = mc.getTempoConsulta();
            r.valorConsulta = mc.getValorConsulta();
        });

        return ResponseEntity.ok(r);
    }

    @PutMapping("/medicos/{id}")
    public ResponseEntity<?> atualizarDadosMedico(@PathVariable Long id, @RequestBody MedicoDadosRequest req) {
        Medico m = medicoRepo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        m.setNome(req.nome);
        m.setSobrenome(req.sobrenome);
        m.setEmail(req.email);
        m.setTelefone(req.telefone);
        m.setDataNascimento(req.dataNascimento);
        m.setEndereco(req.endereco);
        medicoRepo.save(m);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/medicos/{id}/profissional")
    @Transactional
    public ResponseEntity<?> atualizarDadosProfissionais(@PathVariable Long id, @RequestBody MedicoProfissionalRequest req) {
        Medico m = medicoRepo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        m.setCrm(req.crm);
        m.setRqe(req.rqe);
        m.setEspecialidade(req.especialidade);
        m.setSubespecialidades(req.subespecialidades);
        m.setTipoAtendimento(req.tipoAtendimento);
        medicoRepo.save(m);

        MedicoClinica mc = medicoClinicaRepo.findByIdMedico(id).orElseGet(() -> {
            MedicoClinica novo = new MedicoClinica();
            novo.setIdMedico(id);
            return novo;
        });
        mc.setNomeClinica(req.nomeClinica);
        mc.setEnderecoClinica(req.enderecoClinica);
        mc.setTempoConsulta(req.tempoConsulta);
        mc.setValorConsulta(req.valorConsulta);
        medicoClinicaRepo.save(mc);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/medicos/{id}/preferencias")
    public ResponseEntity<?> atualizarPreferencias(@PathVariable Long id, @RequestBody MedicoPreferenciasRequest req) {
        Medico m = medicoRepo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        m.setHorarioInicio(req.horarioInicio);
        m.setHorarioTermino(req.horarioTermino);
        medicoRepo.save(m);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/medicos/{id}/foto")
    public ResponseEntity<?> salvarFotoPerfil(@PathVariable Long id, @RequestBody FotoPerfilRequest req) {
        Medico m = medicoRepo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        m.setFotoPerfil(req.foto);
        medicoRepo.save(m);
        return ResponseEntity.ok().build();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // RELATÓRIO (do paciente) — metadados, upload e download do arquivo
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/relatorios/paciente/{idPaciente}")
    public List<Relatorio> relatoriosPorPaciente(@PathVariable Long idPaciente) {
        return relatorioRepo.findByIdPaciente(idPaciente);
    }

    @GetMapping("/relatorios/{id}/arquivo")
    public ResponseEntity<byte[]> baixarArquivoRelatorio(@PathVariable Long id) {
        Relatorio r = relatorioRepo.findById(id).orElse(null);
        if (r == null || r.getArquivo() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(r.getArquivo());
    }

    @PostMapping(value = "/relatorios", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> salvarRelatorio(@RequestParam Long idPaciente,
                                              @RequestParam String titulo,
                                              @RequestParam(required = false) String tipo,
                                              @RequestParam String data,
                                              @RequestParam MultipartFile arquivo) throws IOException {
        Relatorio r = new Relatorio();
        r.setIdPaciente(idPaciente);
        r.setTitulo(titulo);
        r.setTipo(tipo);
        r.setData(data);
        r.setArquivo(arquivo.getBytes());
        Relatorio salvo = relatorioRepo.save(r);
        return ResponseEntity.ok().body(java.util.Map.of("id", salvo.getId()));
    }

    @DeleteMapping("/relatorios/{id}")
    public void deletarRelatorio(@PathVariable Long id) {
        relatorioRepo.deleteById(id);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // RELATÓRIO DA FARMÁCIA — últimos 10 gerados
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/relatorios-farmacia")
    public List<RelatorioFarmacia> ultimosRelatoriosFarmacia() {
        return relatorioFarmaciaRepo.findTop10ByOrderByGeradoEmDesc();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE — dependentes, alergias e cartões
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/pacientes/{idPaciente}/dependentes")
    public List<Dependente> dependentesPorPaciente(@PathVariable Long idPaciente) {
        return dependenteRepo.findByIdPaciente(idPaciente);
    }

    @GetMapping("/pacientes/{idPaciente}/alergias")
    public List<PacienteAlergia> alergiasPorPaciente(@PathVariable Long idPaciente) {
        return pacienteAlergiaRepo.findByIdIdPaciente(idPaciente);
    }

    @GetMapping("/pacientes/{idPaciente}/cartoes")
    public List<Cartao> cartoesPorPaciente(@PathVariable Long idPaciente) {
        return cartaoRepo.findByIdPaciente(idPaciente);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // MÉDICO — disponibilidade semanal
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/medicos/{idMedico}/disponibilidades")
    public List<DisponibilidadeMedico> disponibilidadesPorMedico(@PathVariable Long idMedico) {
        return disponibilidadeMedicoRepo.findByIdMedico(idMedico);
    }
}
