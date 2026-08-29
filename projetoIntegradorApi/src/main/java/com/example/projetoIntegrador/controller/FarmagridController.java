package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.*;
import com.example.projetoIntegrador.repository.*;
import com.example.projetoIntegrador.service.GenericService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.projetoIntegrador.dto.CadastrarClienteFarmaciaRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FarmagridController {

    @Autowired private GenericService service;

    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private MedicoRepository medicoRepo;
    @Autowired private TeleconsultaRepository teleconsultaRepo;
    @Autowired private ProntuarioRepository prontuarioRepo;
    @Autowired private ReceitaRepository receitaRepo;
    @Autowired private ParceiroRepository parceiroRepo;
    @Autowired private ProdutoRepository produtoRepo;
    @Autowired private CupomRepository cupomRepo;
    @Autowired private ConsultaRepository consultaRepo;
    @Autowired private FarmaPacienteRepository farmaPacienteRepo;
    @Autowired private FuncionarioRepository funcionarioRepo;
    @Autowired private ClienteFarmaRepository clienteFarmaRepo;
    @Autowired private ClienteFarmaciaRepository clienteFarmaciaRepo;
    @Autowired private VendaConcluidaRepository vendaConcluidaRepo;
    @Autowired private RelatorioFarmaciaRepository relatorioFarmaciaRepo;
    @Autowired private DependenteRepository dependenteRepo;
    @Autowired private AlergiaRepository alergiaRepo;
    @Autowired private PacienteAlergiaRepository pacienteAlergiaRepo;
    @Autowired private CartaoRepository cartaoRepo;
    @Autowired private DisponibilidadeMedicoRepository disponibilidadeMedicoRepo;
    

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/pacientes")
    public List<Paciente> listarPacientes() { return service.listar(pacienteRepo); }

    @GetMapping("/pacientes/{id}")
    public Paciente buscarPaciente(@PathVariable Long id) { return service.buscar(pacienteRepo, id); }

    @PostMapping("/pacientes")
    public Paciente criarPaciente(@RequestBody Paciente obj) { return service.salvar(pacienteRepo, obj); }

    @PutMapping("/pacientes/{id}")
    public Paciente atualizarPaciente(@PathVariable Long id, @RequestBody Paciente obj) { return service.atualizar(pacienteRepo, id, obj); }

    @DeleteMapping("/pacientes/{id}")
    public void deletarPaciente(@PathVariable Long id) { service.deletar(pacienteRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // MÉDICO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/medicos")
    public List<Medico> listarMedicos() { return service.listar(medicoRepo); }

    @GetMapping("/medicos/{id}")
    public Medico buscarMedico(@PathVariable Long id) { return service.buscar(medicoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // TELECONSULTA
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/teleconsultas")
    public List<Teleconsulta> listarTeleconsultas() { return service.listar(teleconsultaRepo); }

    @GetMapping("/teleconsultas/{id}")
    public Teleconsulta buscarTeleconsulta(@PathVariable Long id) { return service.buscar(teleconsultaRepo, id); }

    @PostMapping("/teleconsultas")
    public Teleconsulta criarTeleconsulta(@RequestBody Teleconsulta obj) { return service.salvar(teleconsultaRepo, obj); }

    @PutMapping("/teleconsultas/{id}")
    public Teleconsulta atualizarTeleconsulta(@PathVariable Long id, @RequestBody Teleconsulta obj) { return service.atualizar(teleconsultaRepo, id, obj); }

    // ──────────────────────────────────────────────────────────────────────────
    // PRONTUÁRIO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/prontuarios")
    public List<Prontuario> listarProntuarios() { return service.listar(prontuarioRepo); }

    @GetMapping("/prontuarios/{id}")
    public Prontuario buscarProntuario(@PathVariable Long id) { return service.buscar(prontuarioRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // RECEITA
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/receitas/{id}")
    public Receita buscarReceita(@PathVariable Long id) { return service.buscar(receitaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // PARCEIRO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/parceiros")
    public List<Parceiro> listarParceiros() { return service.listar(parceiroRepo); }

    @PostMapping("/parceiros")
    public Parceiro criarParceiro(@RequestBody Parceiro obj) {
        if (obj.getStatus() == null) obj.setStatus("ativo");
        return service.salvar(parceiroRepo, obj);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PRODUTO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/produtos/{id}")
    public Produto buscarProduto(@PathVariable Long id) { return service.buscar(produtoRepo, id); }

    @PostMapping("/produtos")
    public ResponseEntity<?> criarProduto(@RequestBody Produto obj) {
        if (obj.getCodigoBarras() != null && produtoRepo.findByCodigoBarras(obj.getCodigoBarras()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Código de barras já cadastrado.");
        }
        return ResponseEntity.ok(service.salvar(produtoRepo, obj));
    }

    @PutMapping("/produtos/{id}")
    public ResponseEntity<?> atualizarProduto(@PathVariable Long id, @RequestBody Produto obj) {
        if (obj.getCodigoBarras() != null) {
            var existente = produtoRepo.findByCodigoBarras(obj.getCodigoBarras());
            if (existente.isPresent() && !existente.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Código de barras já cadastrado.");
            }
        }
        return ResponseEntity.ok(service.atualizar(produtoRepo, id, obj));
    }

    @DeleteMapping("/produtos/{id}")
    public void deletarProduto(@PathVariable Long id) { service.deletar(produtoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // CUPOM
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/cupons")
    public ResponseEntity<?> criarCupom(@RequestBody Cupom obj) {
        if (cupomRepo.findByCodigo(obj.getCodigo()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Código já existe.");
        }
        obj.setUsosAtuais(0);
        obj.setStatus("ativo");
        return ResponseEntity.ok(service.salvar(cupomRepo, obj));
    }

    @PutMapping("/cupons/{id}")
    public Cupom atualizarCupom(@PathVariable Long id, @RequestBody Cupom obj) { return service.atualizar(cupomRepo, id, obj); }

    @DeleteMapping("/cupons/{id}")
    public void deletarCupom(@PathVariable Long id) { service.deletar(cupomRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // CONSULTA (agenda de teleconsulta)
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/consultas")
    public Consulta criarConsulta(@RequestBody Consulta obj) { return service.salvar(consultaRepo, obj); }

    // ──────────────────────────────────────────────────────────────────────────
    // FARMA PACIENTE (pacientes do módulo farmácia)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/farma-pacientes")
    public List<FarmaPaciente> listarFarmaPacientes() { return service.listar(farmaPacienteRepo); }

    // ──────────────────────────────────────────────────────────────────────────
    // FUNCIONÁRIO (funcFarma, chave é o CPF)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/funcionarios")
    public List<Funcionario> listarFuncionarios(@RequestParam Long idFarmacia) {
        return funcionarioRepo.findByIdFarmacia(idFarmacia);
    }

    @PostMapping("/funcionarios")
    public ResponseEntity<?> criarFuncionario(@RequestBody Funcionario obj) {
        if (funcionarioRepo.existsById(obj.getCpf())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF já cadastrado.");
        }
        return ResponseEntity.ok(funcionarioRepo.save(obj));
    }

    @GetMapping("/funcionarios/{cpf}")
    public ResponseEntity<Funcionario> buscarFuncionario(@PathVariable String cpf) {
        return funcionarioRepo.findById(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CLIENTE (clienteFarma, chave é o CPF)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/clientes/{cpf}")
    public ResponseEntity<ClienteFarma> buscarCliente(
            @PathVariable String cpf,
            @RequestParam Long idFarmacia) {

        String cpfFormatado = cpf.trim();

        ClienteFarmaciaId relacaoId = new ClienteFarmaciaId();
        relacaoId.setCpfCliente(cpfFormatado);
        relacaoId.setIdFarmacia(idFarmacia);

        if (!clienteFarmaciaRepo.existsById(relacaoId)) {
            return ResponseEntity.notFound().build();
        }

        return clienteFarmaRepo.findById(cpfFormatado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/clientes")
        @Transactional
        public ResponseEntity<?> criarCliente(
                @RequestBody CadastrarClienteFarmaciaRequest req) {

            if (req.getCpf() == null || req.getCpf().isBlank()) {
                return ResponseEntity.badRequest()
                        .body("CPF é obrigatório.");
            }

            if (req.getNome() == null || req.getNome().isBlank()) {
                return ResponseEntity.badRequest()
                        .body("Nome é obrigatório.");
            }

            if (req.getIdFarmacia() == null) {
                return ResponseEntity.badRequest()
                        .body("Farmácia é obrigatória.");
            }

            String cpf = req.getCpf().trim();

            ClienteFarmaciaId relacaoId = new ClienteFarmaciaId();
            relacaoId.setCpfCliente(cpf);
            relacaoId.setIdFarmacia(req.getIdFarmacia());

            if (clienteFarmaciaRepo.existsById(relacaoId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Cliente já cadastrado nesta farmácia.");
            }

            ClienteFarma cliente = clienteFarmaRepo.findById(cpf)
                    .orElseGet(() -> {
                        ClienteFarma novo = new ClienteFarma();
                        novo.setCpf(cpf);
                        novo.setNome(req.getNome().trim());
                        novo.setTelefone(
                                req.getTelefone() == null
                                        ? ""
                                        : req.getTelefone().trim()
                        );
                        novo.setEmail(
                                req.getEmail() == null
                                        ? ""
                                        : req.getEmail().trim()
                        );
                        return clienteFarmaRepo.save(novo);
                    });

            ClienteFarmacia relacao = new ClienteFarmacia();
            relacao.setId(relacaoId);
            clienteFarmaciaRepo.save(relacao);

            return ResponseEntity.ok(cliente);
        }

    // ──────────────────────────────────────────────────────────────────────────
    // VENDA CONCLUÍDA
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/vendas")
    public List<VendaConcluida> listarVendas(@RequestParam Long idFarmacia) {
        return vendaConcluidaRepo.findByIdFarmacia(idFarmacia);
    }

    @PostMapping("/vendas")
    public VendaConcluida salvarVenda(@RequestBody VendaConcluida obj) { return vendaConcluidaRepo.save(obj); }

    // ──────────────────────────────────────────────────────────────────────────
    // RELATÓRIO FARMÁCIA (metadados: geração do arquivo em si continua no Electron)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/relatorios-farmacia/{id}")
    public RelatorioFarmacia buscarRelatorioFarmacia(@PathVariable Long id) { return service.buscar(relatorioFarmaciaRepo, id); }

    @PostMapping("/relatorios-farmacia")
    public RelatorioFarmacia criarRelatorioFarmacia(@RequestBody RelatorioFarmacia obj) { return service.salvar(relatorioFarmaciaRepo, obj); }

    // ──────────────────────────────────────────────────────────────────────────
    // DEPENDENTE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/dependentes/{id}")
    public Dependente buscarDependente(@PathVariable Long id) { return service.buscar(dependenteRepo, id); }

    @PostMapping("/dependentes")
    public Dependente criarDependente(@RequestBody Dependente obj) { return service.salvar(dependenteRepo, obj); }

    @PutMapping("/dependentes/{id}")
    public Dependente atualizarDependente(@PathVariable Long id, @RequestBody Dependente obj) { return service.atualizar(dependenteRepo, id, obj); }

    @DeleteMapping("/dependentes/{id}")
    public void deletarDependente(@PathVariable Long id) { service.deletar(dependenteRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // ALERGIA (catálogo)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/alergias")
    public List<Alergia> listarAlergias() { return service.listar(alergiaRepo); }

    @PostMapping("/alergias")
    public Alergia criarAlergia(@RequestBody Alergia obj) { return service.salvar(alergiaRepo, obj); }

    @DeleteMapping("/alergias/{id}")
    public void deletarAlergia(@PathVariable Long id) { service.deletar(alergiaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE_ALERGIA (associação, chave composta id_paciente + id_alergia)
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/paciente-alergias")
    public PacienteAlergia criarPacienteAlergia(@RequestBody PacienteAlergiaId id) {
        PacienteAlergia obj = new PacienteAlergia();
        obj.setId(id);
        return pacienteAlergiaRepo.save(obj);
    }

    @DeleteMapping("/paciente-alergias/{idPaciente}/{idAlergia}")
    public void deletarPacienteAlergia(@PathVariable Long idPaciente, @PathVariable Long idAlergia) {
        PacienteAlergiaId id = new PacienteAlergiaId();
        id.setIdPaciente(idPaciente);
        id.setIdAlergia(idAlergia);
        pacienteAlergiaRepo.deleteById(id);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CARTÃO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/cartoes/{id}")
    public Cartao buscarCartao(@PathVariable Long id) { return service.buscar(cartaoRepo, id); }

    @PostMapping("/cartoes")
    public Cartao criarCartao(@RequestBody Cartao obj) { return service.salvar(cartaoRepo, obj); }

    @PutMapping("/cartoes/{id}")
    public Cartao atualizarCartao(@PathVariable Long id, @RequestBody Cartao obj) { return service.atualizar(cartaoRepo, id, obj); }

    @DeleteMapping("/cartoes/{id}")
    public void deletarCartao(@PathVariable Long id) { service.deletar(cartaoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // DISPONIBILIDADE MÉDICO
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/disponibilidades")
    public DisponibilidadeMedico criarDisponibilidade(@RequestBody DisponibilidadeMedico obj) { return service.salvar(disponibilidadeMedicoRepo, obj); }

    @PutMapping("/disponibilidades/{id}")
    public DisponibilidadeMedico atualizarDisponibilidade(@PathVariable Long id, @RequestBody DisponibilidadeMedico obj) { return service.atualizar(disponibilidadeMedicoRepo, id, obj); }

    @DeleteMapping("/disponibilidades/{id}")
    public void deletarDisponibilidade(@PathVariable Long id) { service.deletar(disponibilidadeMedicoRepo, id); }
}
