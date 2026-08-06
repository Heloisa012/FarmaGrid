package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.*;
import com.example.projetoIntegrador.repository.*;
import com.example.projetoIntegrador.service.GenericService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FarmagridController {

    @Autowired private GenericService service;

    // ── repositórios existentes ──────────────────────────────────────────────
    @Autowired private PlanoPacienteRepository planoPacienteRepo;
    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private MedicoRepository medicoRepo;
    @Autowired private StatusRepository statusRepo;
    @Autowired private TeleconsultaRepository teleconsultaRepo;
    @Autowired private MedicamentoRepository medicamentoRepo;
    @Autowired private FarmaciaRepository farmaciaRepo;
    @Autowired private StatusEstoqueRepository statusEstoqueRepo;
    @Autowired private EstoqueRepository estoqueRepo;
    @Autowired private ReceitaRepository receitaRepo;
    @Autowired private ProntuarioRepository prontuarioRepo;
    @Autowired private FuncionarioRepository funcionarioRepo;
    @Autowired private UsuarioRepository usuarioRepo;

    // ── repositórios novos ───────────────────────────────────────────────────
    @Autowired private ParceriaRepository parceriaRepo;
    @Autowired private ValidadeRepository validadeRepo;
    @Autowired private DescontoRepository descontoRepo;
    @Autowired private VendaRepository vendaRepo;

    // ── repositórios novos (paciente extras) ─────────────────────────────────
    @Autowired private DependenteRepository dependenteRepo;
    @Autowired private AlergiaRepository alergiaRepo;
    @Autowired private PacienteAlergiaRepository pacienteAlergiaRepo;
    @Autowired private CartaoRepository cartaoRepo;
    @Autowired private DisponibilidadeMedicoRepository disponibilidadeMedicoRepo;

    // ──────────────────────────────────────────────────────────────────────────
    // PLANO PACIENTE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/planos")
    public List<PlanoPaciente> listarPlanos() { return service.listar(planoPacienteRepo); }

    @GetMapping("/planos/{id}")
    public PlanoPaciente buscarPlano(@PathVariable Long id) { return service.buscar(planoPacienteRepo, id); }

    @PostMapping("/planos")
    public PlanoPaciente criarPlano(@RequestBody PlanoPaciente obj) { return service.salvar(planoPacienteRepo, obj); }

    @PutMapping("/planos/{id}")
    public PlanoPaciente atualizarPlano(@PathVariable Long id, @RequestBody PlanoPaciente obj) { return service.atualizar(planoPacienteRepo, id, obj); }

    @DeleteMapping("/planos/{id}")
    public void deletarPlano(@PathVariable Long id) { service.deletar(planoPacienteRepo, id); }

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

    @PostMapping("/medicos")
    public Medico criarMedico(@RequestBody Medico obj) { return service.salvar(medicoRepo, obj); }

    @PutMapping("/medicos/{id}")
    public Medico atualizarMedico(@PathVariable Long id, @RequestBody Medico obj) { return service.atualizar(medicoRepo, id, obj); }

    @DeleteMapping("/medicos/{id}")
    public void deletarMedico(@PathVariable Long id) { service.deletar(medicoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // STATUS
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/status")
    public List<Status> listarStatus() { return service.listar(statusRepo); }

    @GetMapping("/status/{id}")
    public Status buscarStatus(@PathVariable Long id) { return service.buscar(statusRepo, id); }

    @PostMapping("/status")
    public Status criarStatus(@RequestBody Status obj) { return service.salvar(statusRepo, obj); }

    @PutMapping("/status/{id}")
    public Status atualizarStatus(@PathVariable Long id, @RequestBody Status obj) { return service.atualizar(statusRepo, id, obj); }

    @DeleteMapping("/status/{id}")
    public void deletarStatus(@PathVariable Long id) { service.deletar(statusRepo, id); }

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

    @DeleteMapping("/teleconsultas/{id}")
    public void deletarTeleconsulta(@PathVariable Long id) { service.deletar(teleconsultaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // MEDICAMENTO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/medicamentos")
    public List<Medicamento> listarMedicamentos() { return service.listar(medicamentoRepo); }

    @GetMapping("/medicamentos/{id}")
    public Medicamento buscarMedicamento(@PathVariable Long id) { return service.buscar(medicamentoRepo, id); }

    @PostMapping("/medicamentos")
    public Medicamento criarMedicamento(@RequestBody Medicamento obj) { return service.salvar(medicamentoRepo, obj); }

    @PutMapping("/medicamentos/{id}")
    public Medicamento atualizarMedicamento(@PathVariable Long id, @RequestBody Medicamento obj) { return service.atualizar(medicamentoRepo, id, obj); }

    @DeleteMapping("/medicamentos/{id}")
    public void deletarMedicamento(@PathVariable Long id) { service.deletar(medicamentoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // FARMÁCIA
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/farmacias")
    public List<Farmacia> listarFarmacias() { return service.listar(farmaciaRepo); }

    @GetMapping("/farmacias/{id}")
    public Farmacia buscarFarmacia(@PathVariable Long id) { return service.buscar(farmaciaRepo, id); }

    @PostMapping("/farmacias")
    public Farmacia criarFarmacia(@RequestBody Farmacia obj) { return service.salvar(farmaciaRepo, obj); }

    @PutMapping("/farmacias/{id}")
    public Farmacia atualizarFarmacia(@PathVariable Long id, @RequestBody Farmacia obj) { return service.atualizar(farmaciaRepo, id, obj); }

    @DeleteMapping("/farmacias/{id}")
    public void deletarFarmacia(@PathVariable Long id) { service.deletar(farmaciaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // STATUS ESTOQUE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/status-estoque")
    public List<StatusEstoque> listarStatusEstoque() { return service.listar(statusEstoqueRepo); }

    @GetMapping("/status-estoque/{id}")
    public StatusEstoque buscarStatusEstoque(@PathVariable Long id) { return service.buscar(statusEstoqueRepo, id); }

    @PostMapping("/status-estoque")
    public StatusEstoque criarStatusEstoque(@RequestBody StatusEstoque obj) { return service.salvar(statusEstoqueRepo, obj); }

    @PutMapping("/status-estoque/{id}")
    public StatusEstoque atualizarStatusEstoque(@PathVariable Long id, @RequestBody StatusEstoque obj) { return service.atualizar(statusEstoqueRepo, id, obj); }

    @DeleteMapping("/status-estoque/{id}")
    public void deletarStatusEstoque(@PathVariable Long id) { service.deletar(statusEstoqueRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // ESTOQUE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/estoques")
    public List<Estoque> listarEstoques() { return service.listar(estoqueRepo); }

    @GetMapping("/estoques/{id}")
    public Estoque buscarEstoque(@PathVariable Long id) { return service.buscar(estoqueRepo, id); }

    @PostMapping("/estoques")
    public Estoque criarEstoque(@RequestBody Estoque obj) { return service.salvar(estoqueRepo, obj); }

    @PutMapping("/estoques/{id}")
    public Estoque atualizarEstoque(@PathVariable Long id, @RequestBody Estoque obj) { return service.atualizar(estoqueRepo, id, obj); }

    @DeleteMapping("/estoques/{id}")
    public void deletarEstoque(@PathVariable Long id) { service.deletar(estoqueRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // RECEITA (medicamentos do paciente)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/receitas")
    public List<Receita> listarReceitas() { return service.listar(receitaRepo); }

    @GetMapping("/receitas/{id}")
    public Receita buscarReceita(@PathVariable Long id) { return service.buscar(receitaRepo, id); }

    @PostMapping("/receitas")
    public Receita criarReceita(@RequestBody Receita obj) { return service.salvar(receitaRepo, obj); }

    @PutMapping("/receitas/{id}")
    public Receita atualizarReceita(@PathVariable Long id, @RequestBody Receita obj) { return service.atualizar(receitaRepo, id, obj); }

    @DeleteMapping("/receitas/{id}")
    public void deletarReceita(@PathVariable Long id) { service.deletar(receitaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // PRONTUÁRIO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/prontuarios")
    public List<Prontuario> listarProntuarios() { return service.listar(prontuarioRepo); }

    @GetMapping("/prontuarios/{id}")
    public Prontuario buscarProntuario(@PathVariable Long id) { return service.buscar(prontuarioRepo, id); }

    @PostMapping("/prontuarios")
    public Prontuario criarProntuario(@RequestBody Prontuario obj) { return service.salvar(prontuarioRepo, obj); }

    @PutMapping("/prontuarios/{id}")
    public Prontuario atualizarProntuario(@PathVariable Long id, @RequestBody Prontuario obj) { return service.atualizar(prontuarioRepo, id, obj); }

    @DeleteMapping("/prontuarios/{id}")
    public void deletarProntuario(@PathVariable Long id) { service.deletar(prontuarioRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // FUNCIONÁRIO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/funcionarios")
    public List<Funcionario> listarFuncionarios() { return service.listar(funcionarioRepo); }

    @GetMapping("/funcionarios/{id}")
    public Funcionario buscarFuncionario(@PathVariable Long id) { return service.buscar(funcionarioRepo, id); }

    @PostMapping("/funcionarios")
    public Funcionario criarFuncionario(@RequestBody Funcionario obj) { return service.salvar(funcionarioRepo, obj); }

    @PutMapping("/funcionarios/{id}")
    public Funcionario atualizarFuncionario(@PathVariable Long id, @RequestBody Funcionario obj) { return service.atualizar(funcionarioRepo, id, obj); }

    @DeleteMapping("/funcionarios/{id}")
    public void deletarFuncionario(@PathVariable Long id) { service.deletar(funcionarioRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // USUÁRIO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() { return service.listar(usuarioRepo); }

    @GetMapping("/usuarios/{id}")
    public Usuario buscarUsuario(@PathVariable Long id) { return service.buscar(usuarioRepo, id); }

    @PostMapping("/usuarios")
    public Usuario criarUsuario(@RequestBody Usuario obj) { return service.salvar(usuarioRepo, obj); }

    @PutMapping("/usuarios/{id}")
    public Usuario atualizarUsuario(@PathVariable Long id, @RequestBody Usuario obj) { return service.atualizar(usuarioRepo, id, obj); }

    @DeleteMapping("/usuarios/{id}")
    public void deletarUsuario(@PathVariable Long id) { service.deletar(usuarioRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // PARCERIA
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/parcerias")
    public List<Parceria> listarParcerias() { return service.listar(parceriaRepo); }

    @GetMapping("/parcerias/{id}")
    public Parceria buscarParceria(@PathVariable Long id) { return service.buscar(parceriaRepo, id); }

    @PostMapping("/parcerias")
    public Parceria criarParceria(@RequestBody Parceria obj) { return service.salvar(parceriaRepo, obj); }

    @PutMapping("/parcerias/{id}")
    public Parceria atualizarParceria(@PathVariable Long id, @RequestBody Parceria obj) { return service.atualizar(parceriaRepo, id, obj); }

    @DeleteMapping("/parcerias/{id}")
    public void deletarParceria(@PathVariable Long id) { service.deletar(parceriaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // VALIDADE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/validades")
    public List<Validade> listarValidades() { return service.listar(validadeRepo); }

    @GetMapping("/validades/{id}")
    public Validade buscarValidade(@PathVariable Long id) { return service.buscar(validadeRepo, id); }

    @PostMapping("/validades")
    public Validade criarValidade(@RequestBody Validade obj) { return service.salvar(validadeRepo, obj); }

    @PutMapping("/validades/{id}")
    public Validade atualizarValidade(@PathVariable Long id, @RequestBody Validade obj) { return service.atualizar(validadeRepo, id, obj); }

    @DeleteMapping("/validades/{id}")
    public void deletarValidade(@PathVariable Long id) { service.deletar(validadeRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // DESCONTO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/descontos")
    public List<Desconto> listarDescontos() { return service.listar(descontoRepo); }

    @GetMapping("/descontos/{id}")
    public Desconto buscarDesconto(@PathVariable Long id) { return service.buscar(descontoRepo, id); }

    @PostMapping("/descontos")
    public Desconto criarDesconto(@RequestBody Desconto obj) { return service.salvar(descontoRepo, obj); }

    @PutMapping("/descontos/{id}")
    public Desconto atualizarDesconto(@PathVariable Long id, @RequestBody Desconto obj) { return service.atualizar(descontoRepo, id, obj); }

    @DeleteMapping("/descontos/{id}")
    public void deletarDesconto(@PathVariable Long id) { service.deletar(descontoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // VENDA
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/vendas")
    public List<Venda> listarVendas() { return service.listar(vendaRepo); }

    @GetMapping("/vendas/{id}")
    public Venda buscarVenda(@PathVariable Long id) { return service.buscar(vendaRepo, id); }

    @PostMapping("/vendas")
    public Venda criarVenda(@RequestBody Venda obj) { return service.salvar(vendaRepo, obj); }

    @PutMapping("/vendas/{id}")
    public Venda atualizarVenda(@PathVariable Long id, @RequestBody Venda obj) { return service.atualizar(vendaRepo, id, obj); }

    @DeleteMapping("/vendas/{id}")
    public void deletarVenda(@PathVariable Long id) { service.deletar(vendaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // DEPENDENTE
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/dependentes")
    public List<Dependente> listarDependentes() { return service.listar(dependenteRepo); }

    @GetMapping("/dependentes/{id}")
    public Dependente buscarDependente(@PathVariable Long id) { return service.buscar(dependenteRepo, id); }

    @GetMapping("/pacientes/{idPaciente}/dependentes")
    public List<Dependente> listarDependentesPorPaciente(@PathVariable Long idPaciente) { return dependenteRepo.findByPacienteId(idPaciente); }

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

    @GetMapping("/alergias/{id}")
    public Alergia buscarAlergia(@PathVariable Long id) { return service.buscar(alergiaRepo, id); }

    @PostMapping("/alergias")
    public Alergia criarAlergia(@RequestBody Alergia obj) { return service.salvar(alergiaRepo, obj); }

    @PutMapping("/alergias/{id}")
    public Alergia atualizarAlergia(@PathVariable Long id, @RequestBody Alergia obj) { return service.atualizar(alergiaRepo, id, obj); }

    @DeleteMapping("/alergias/{id}")
    public void deletarAlergia(@PathVariable Long id) { service.deletar(alergiaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE_ALERGIA (associação paciente ↔ alergia)
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/paciente-alergias")
    public List<PacienteAlergia> listarPacienteAlergias() { return service.listar(pacienteAlergiaRepo); }

    @GetMapping("/paciente-alergias/{id}")
    public PacienteAlergia buscarPacienteAlergia(@PathVariable Long id) { return service.buscar(pacienteAlergiaRepo, id); }

    @GetMapping("/pacientes/{idPaciente}/alergias")
    public List<PacienteAlergia> listarAlergiasPorPaciente(@PathVariable Long idPaciente) { return pacienteAlergiaRepo.findByPacienteId(idPaciente); }

    @PostMapping("/paciente-alergias")
    public PacienteAlergia criarPacienteAlergia(@RequestBody PacienteAlergia obj) { return service.salvar(pacienteAlergiaRepo, obj); }

    @PutMapping("/paciente-alergias/{id}")
    public PacienteAlergia atualizarPacienteAlergia(@PathVariable Long id, @RequestBody PacienteAlergia obj) { return service.atualizar(pacienteAlergiaRepo, id, obj); }

    @DeleteMapping("/paciente-alergias/{id}")
    public void deletarPacienteAlergia(@PathVariable Long id) { service.deletar(pacienteAlergiaRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // CARTÃO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/cartoes")
    public List<Cartao> listarCartoes() { return service.listar(cartaoRepo); }

    @GetMapping("/cartoes/{id}")
    public Cartao buscarCartao(@PathVariable Long id) { return service.buscar(cartaoRepo, id); }

    @GetMapping("/pacientes/{idPaciente}/cartoes")
    public List<Cartao> listarCartoesPorPaciente(@PathVariable Long idPaciente) { return cartaoRepo.findByPacienteId(idPaciente); }

    @PostMapping("/cartoes")
    public Cartao criarCartao(@RequestBody Cartao obj) { return service.salvar(cartaoRepo, obj); }

    @PutMapping("/cartoes/{id}")
    public Cartao atualizarCartao(@PathVariable Long id, @RequestBody Cartao obj) { return service.atualizar(cartaoRepo, id, obj); }

    @DeleteMapping("/cartoes/{id}")
    public void deletarCartao(@PathVariable Long id) { service.deletar(cartaoRepo, id); }

    // ──────────────────────────────────────────────────────────────────────────
    // DISPONIBILIDADE MÉDICO
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/disponibilidades")
    public List<DisponibilidadeMedico> listarDisponibilidades() { return service.listar(disponibilidadeMedicoRepo); }

    @GetMapping("/disponibilidades/{id}")
    public DisponibilidadeMedico buscarDisponibilidade(@PathVariable Long id) { return service.buscar(disponibilidadeMedicoRepo, id); }

    @GetMapping("/medicos/{idMedico}/disponibilidades")
    public List<DisponibilidadeMedico> listarDisponibilidadesPorMedico(@PathVariable Long idMedico) { return disponibilidadeMedicoRepo.findByMedicoId(idMedico); }

    @PostMapping("/disponibilidades")
    public DisponibilidadeMedico criarDisponibilidade(@RequestBody DisponibilidadeMedico obj) { return service.salvar(disponibilidadeMedicoRepo, obj); }

    @PutMapping("/disponibilidades/{id}")
    public DisponibilidadeMedico atualizarDisponibilidade(@PathVariable Long id, @RequestBody DisponibilidadeMedico obj) { return service.atualizar(disponibilidadeMedicoRepo, id, obj); }

    @DeleteMapping("/disponibilidades/{id}")
    public void deletarDisponibilidade(@PathVariable Long id) { service.deletar(disponibilidadeMedicoRepo, id); }
}