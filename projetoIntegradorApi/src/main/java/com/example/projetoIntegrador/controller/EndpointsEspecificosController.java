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
import java.time.LocalDate;

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
    @Autowired private ProntuarioRepository prontuarioRepo;
    @Autowired private LoginRepository loginRepo;
    @Autowired private SolicitacaoExameRepository solicitacaoExameRepo;

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE — busca por nome
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/pacientes/buscar")
    public List<Paciente> buscarPorNome(@RequestParam String nome) {
        return pacienteRepo.findByNomeContainingIgnoreCase(nome);
    }

    @GetMapping("/medicos/{idMedico}/pacientes")
    public List<PacienteMedicoResponse> pacientesDoMedico(@PathVariable Long idMedico) {
        return pacienteRepo.findAll().stream()
          .filter(paciente -> teleconsultaRepo.existsByIdMedicoAndIdPaciente(idMedico, paciente.getId()))
          .map(paciente -> {
            PacienteMedicoResponse r = new PacienteMedicoResponse();
            r.id = paciente.getId();
            r.nome = paciente.getNome();
            r.cpf = paciente.getCpf();
            r.idade = paciente.getIdade();
            r.fotoPerfil = paciente.getFotoPerfil();
            prontuarioRepo.findFirstByIdPacienteOrderByIdDesc(paciente.getId()).ifPresent(prontuario -> {
                r.condicao = prontuario.getCondicao();
                r.ultimaVisita = prontuario.getUltimaVisita();
                r.status = prontuario.getStatus();
                if (prontuario.getCondicao() != null && !prontuario.getCondicao().isBlank()) {
                    r.condicoes.add(prontuario.getCondicao());
                }
            });
            r.totalConsultas = teleconsultaRepo.countByIdPaciente(paciente.getId());
            r.totalReceitas = receitaRepo.countByIdPaciente(paciente.getId());
            return r;
        }).collect(Collectors.toList());
    }

    // ──────────────────────────────────────────────────────────────────────────
    // TELECONSULTA — por médico (ordenada) e por paciente
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/teleconsultas/medico/{idMedico}")
    public List<Teleconsulta> consultasPorMedico(@PathVariable Long idMedico) {
        List<Teleconsulta> consultas = teleconsultaRepo.findByIdMedicoOrderByData(idMedico);
        consultas.forEach(c -> {
            if (c.getNomePaciente() == null || c.getNomePaciente().isBlank()) {
                pacienteRepo.findById(c.getIdPaciente()).ifPresent(p -> c.setNomePaciente(p.getNome()));
            }
        });
        return consultas;
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
        return receitaRepo.findByIdPacienteOrderByIdDesc(idPaciente);
    }

    @GetMapping("/medicos-disponiveis")
    public List<java.util.Map<String, Object>> medicosDisponiveis() {
        return medicoRepo.findAll().stream().map(m -> {
            java.util.Map<String, Object> r = new java.util.HashMap<>();
            r.put("id", m.getId()); r.put("nome", m.getNome());
            r.put("sobrenome", m.getSobrenome()); r.put("especialidade", m.getEspecialidade());
            r.put("crm", m.getCrm()); return r;
        }).collect(Collectors.toList());
    }

    @GetMapping("/solicitacoes-exame/paciente/{idPaciente}")
    public List<SolicitacaoExame> solicitacoesExame(@PathVariable Long idPaciente) {
        return solicitacaoExameRepo.findByIdPacienteOrderByIdDesc(idPaciente);
    }

    @PostMapping("/solicitacoes-exame")
    public ResponseEntity<SolicitacaoExame> solicitarExame(@RequestBody SolicitacaoExame item) {
        item.setId(null); item.setStatus("Solicitado");
        item.setSolicitadoEm(LocalDate.now().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoExameRepo.save(item));
    }

    @PutMapping("/pacientes/{idPaciente}/assinatura")
    public ResponseEntity<?> alterarAssinatura(@PathVariable Long idPaciente, @RequestBody AssinaturaRequest req) {
        Paciente p = pacienteRepo.findById(idPaciente).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        p.setPlanoPremium(req.premium);
        p.setAssinaturaStatus(req.premium ? "ATIVA" : "CANCELADA");
        p.setAssinaturaValidade(req.premium ? LocalDate.now().plusMonths(1).toString() : null);
        pacienteRepo.save(p);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/receitas/medico/{idMedico}")
    public List<Receita> receitasPorMedico(@PathVariable Long idMedico) {
        return receitaRepo.findByIdMedicoOrderByIdDesc(idMedico);
    }

    @PostMapping("/receitas")
    public ResponseEntity<Receita> salvarReceita(@RequestBody Receita receita) {
        if (receita.getDataPrescricao() == null || receita.getDataPrescricao().isBlank()) {
            receita.setDataPrescricao(LocalDate.now().toString());
        }
        if (receita.getStatus() == null || receita.getStatus().isBlank()) receita.setStatus("Ativa");
        return ResponseEntity.status(HttpStatus.CREATED).body(receitaRepo.save(receita));
    }

    @GetMapping("/prontuarios/paciente/{idPaciente}")
    public List<Prontuario> prontuariosPorPaciente(@PathVariable Long idPaciente) {
        return prontuarioRepo.findByIdPacienteOrderByIdDesc(idPaciente);
    }

    @PostMapping("/prontuarios")
    public ResponseEntity<Prontuario> salvarProntuario(@RequestBody Prontuario prontuario) {
        if (prontuario.getStatus() == null || prontuario.getStatus().isBlank()) prontuario.setStatus("Ativo");
        return ResponseEntity.status(HttpStatus.CREATED).body(prontuarioRepo.save(prontuario));
    }

    @PutMapping("/prontuarios/{id}")
    public ResponseEntity<?> editarProntuario(@PathVariable Long id, @RequestBody Prontuario dados) {
        Prontuario p = prontuarioRepo.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        if (dados.getIdMedico() != null) p.setIdMedico(dados.getIdMedico());
        p.setCondicao(dados.getCondicao()); p.setCid10(dados.getCid10()); p.setAnamnese(dados.getAnamnese());
        p.setExameFisico(dados.getExameFisico()); p.setConduta(dados.getConduta()); p.setDataRetorno(dados.getDataRetorno());
        p.setPa(dados.getPa()); p.setTemperatura(dados.getTemperatura()); p.setPeso(dados.getPeso()); p.setSpo2(dados.getSpo2());
        p.setNotas(dados.getNotas()); p.setStatus(dados.getStatus()); p.setUltimaVisita(dados.getUltimaVisita());
        return ResponseEntity.ok(prontuarioRepo.save(p));
    }

    @GetMapping("/medicos/{idMedico}/painel")
    public java.util.Map<String, Object> painelMedico(@PathVariable Long idMedico) {
        List<Teleconsulta> consultas = teleconsultaRepo.findByIdMedicoOrderByData(idMedico);
        List<Receita> receitas = receitaRepo.findByIdMedicoOrderByIdDesc(idMedico);
        List<Prontuario> prontuarios = prontuarioRepo.findByIdMedicoOrderByIdDesc(idMedico);
        java.time.YearMonth mes = java.time.YearMonth.now();
        long consultasMes = consultas.stream().filter(c -> {
            try { return java.time.YearMonth.from(LocalDate.parse(c.getData())).equals(mes); } catch (Exception e) { return false; }
        }).count();
        long receitasMes = receitas.stream().filter(r -> {
            try { return java.time.YearMonth.from(LocalDate.parse(r.getDataPrescricao())).equals(mes); } catch (Exception e) { return false; }
        }).count();
        java.util.Map<String, Long> tipos = consultas.stream().filter(c -> {
            try { return java.time.YearMonth.from(LocalDate.parse(c.getData())).equals(mes); } catch (Exception e) { return false; }
        }).collect(Collectors.groupingBy(c -> c.getTipo() == null ? "Consulta" : c.getTipo(), Collectors.counting()));
        java.util.Map<String, Long> diagnosticos = prontuarios.stream()
            .filter(p -> p.getCondicao() != null && !p.getCondicao().isBlank())
            .collect(Collectors.groupingBy(Prontuario::getCondicao, Collectors.counting()));
        java.util.Map<String, Object> r = new java.util.LinkedHashMap<>();
        r.put("consultasMes", consultasMes); r.put("receitasMes", receitasMes);
        r.put("totalPacientes", consultas.stream().map(Teleconsulta::getIdPaciente).distinct().count());
        r.put("tiposConsulta", tipos); r.put("diagnosticos", diagnosticos);
        r.put("consultas", consultas); r.put("prontuarios", prontuarios);
        return r;
    }

    @PatchMapping("/teleconsultas/{id}/reagendar")
    public ResponseEntity<?> reagendarTeleconsulta(@PathVariable Long id, @RequestBody ReagendarConsultaRequest req) {
        Teleconsulta consulta = teleconsultaRepo.findById(id).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();
        consulta.setData(req.novaData);
        consulta.setHorario(req.novoHorario);
        consulta.setDuracao(req.novaDuracao);
        teleconsultaRepo.save(consulta);
        return ResponseEntity.ok(consulta);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CUPOM — lista com expiração automática (mesma regra do main.js)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/cupons")
    @Transactional
    public List<Cupom> listarCupons(@RequestParam Long idFarmacia) {
        LocalDate hoje = LocalDate.now();
        for (Cupom c : cupomRepo.findByStatusAndIdFarmacia("ativo", idFarmacia)) {
            boolean expiradoPorData = c.getValidade() != null && c.getValidade().isBefore(hoje);
            boolean expiradoPorUso = c.getLimiteUso() != null && c.getLimiteUso() > 0
                    && c.getUsosAtuais() != null && c.getUsosAtuais() >= c.getLimiteUso();
            if (expiradoPorData || expiradoPorUso) {
                c.setStatus("expirado");
                cupomRepo.save(c);
            }
        }
        return cupomRepo.findAllOrderByStatusAndCodigo(idFarmacia);
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
    public List<Produto> listarProdutos(@RequestParam Long idFarmacia) {
        List<Produto> produtos = produtoRepo.findAllByIdFarmaciaOrderByNomeAsc(idFarmacia);
        for (Produto p : produtos) {
            p.setProximaValidade(loteRepo.proximaValidade(p.getId()));
            p.setTotalLotes(loteRepo.totalLotes(p.getId()));
        }
        return produtos;
    }

    @GetMapping("/produtos/estoque-baixo")
    public List<Produto> produtosEstoqueBaixo(@RequestParam Long idFarmacia) {
        return produtoRepo.findEstoqueBaixo(idFarmacia);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // LOTE — todos (com nome do produto), por produto, criação (entrada/saída) e remoção
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/lotes")
        public List<LoteComProdutoResponse> listarLotes(@RequestParam Long idFarmacia) {
            return loteRepo.findAllByFarmaciaOrderByDataValidadeAsc(idFarmacia).stream()
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

    @PatchMapping("/lotes/{id}/prateleira")
    public ResponseEntity<?> atualizarPrateleira(
            @PathVariable Long id,
            @RequestBody Lote dados) {

        Lote lote = loteRepo.findById(id).orElse(null);

        if (lote == null) {
            return ResponseEntity.notFound().build();
        }

        lote.setPrateleira(dados.getPrateleira());
        loteRepo.save(lote);

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
    @Transactional
    public ResponseEntity<?> atualizarDadosMedico(@PathVariable Long id, @RequestBody MedicoDadosRequest req) {
        Medico m = medicoRepo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        Login login = loginRepo.findByIdMedico(id).orElse(null);
        if (login == null) return ResponseEntity.notFound().build();
        if (req.email != null && !req.email.equalsIgnoreCase(login.getEmail())
                && loginRepo.existsByEmailAndIdNot(req.email, login.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Este e-mail já está em uso.");
        }
        m.setNome(req.nome);
        m.setSobrenome(req.sobrenome);
        m.setEmail(req.email);
        m.setTelefone(req.telefone);
        m.setDataNascimento(req.dataNascimento);
        m.setEndereco(req.endereco);
        login.setEmail(req.email);
        medicoRepo.save(m);
        loginRepo.save(login);
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
