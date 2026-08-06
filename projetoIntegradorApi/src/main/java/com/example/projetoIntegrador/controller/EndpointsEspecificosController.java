package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.*;
import com.example.projetoIntegrador.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class EndpointsEspecificosController {

    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private TeleconsultaRepository teleconsultaRepo;
    @Autowired private ReceitaRepository receitaRepo;
    @Autowired private DescontoRepository descontoRepo;
    @Autowired private ValidadeRepository validadeRepo;
    @Autowired private VendaRepository vendaRepo;

    // ──────────────────────────────────────────────────────────────────────────
    // PACIENTE — busca por CPF e por nome
    // GET /api/pacientes/cpf/{cpf}
    // GET /api/pacientes/buscar?nome=João
    // ──────────────────────────────────────────────────────────────────────────

    @GetMapping("/pacientes/cpf/{cpf}")
    public ResponseEntity<Paciente> buscarPorCpf(@PathVariable String cpf) {
        return pacienteRepo.findByCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pacientes/buscar")
    public List<Paciente> buscarPorNome(@RequestParam String nome) {
        return pacienteRepo.findByNomeContainingIgnoreCase(nome);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // TELECONSULTA — por médico e por paciente
    // GET /api/teleconsultas/medico/{idMedico}
    // GET /api/teleconsultas/paciente/{idPaciente}
    // ──────────────────────────────────────────────────────────────────────────

    @GetMapping("/teleconsultas/medico/{idMedico}")
    public List<Teleconsulta> consultasPorMedico(@PathVariable Long idMedico) {
        return teleconsultaRepo.findByMedicoIdOrderByDataAscHorarioAsc(idMedico);
    }

    @GetMapping("/teleconsultas/paciente/{idPaciente}")
    public List<Teleconsulta> consultasPorPaciente(@PathVariable Long idPaciente) {
        return teleconsultaRepo.findByPacienteId(idPaciente);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // RECEITA — por paciente
    // GET /api/receitas/paciente/{idPaciente}
    // ──────────────────────────────────────────────────────────────────────────

    @GetMapping("/receitas/paciente/{idPaciente}")
    public List<Receita> receitasPorPaciente(@PathVariable Long idPaciente) {
        return receitaRepo.findByPacienteId(idPaciente);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DESCONTO — validar cupom e usar cupom
    // GET  /api/descontos/validar/{cupom}
    // POST /api/descontos/usar/{cupom}
    // ──────────────────────────────────────────────────────────────────────────

    @GetMapping("/descontos/validar/{cupom}")
    public ResponseEntity<String> validarCupom(@PathVariable String cupom) {
        var opcional = descontoRepo.findCupomValido(cupom);
        if (opcional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cupom inválido ou expirado.");
        }
        return ResponseEntity.ok("Cupom válido: " + opcional.get().getNomeCupom());
    }

    @PostMapping("/descontos/usar/{cupom}")
    public ResponseEntity<String> usarCupom(@PathVariable String cupom) {
        var opcional = descontoRepo.findCupomValido(cupom);
        if (opcional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cupom inválido.");
        }
        Desconto desconto = opcional.get();
        desconto.setUsosRealizados(desconto.getUsosRealizados() + 1);
        if (desconto.getLimiteUsos() != null
                && desconto.getUsosRealizados() >= desconto.getLimiteUsos()) {
            desconto.setStatus("EXPIRADO");
        }
        descontoRepo.save(desconto);
        return ResponseEntity.ok("Cupom utilizado com sucesso.");
    }

    // ──────────────────────────────────────────────────────────────────────────
    // VALIDADE — por estoque
    // GET /api/validades/estoque/{idEstoque}
    // ──────────────────────────────────────────────────────────────────────────

    @GetMapping("/validades/estoque/{idEstoque}")
    public List<Validade> validadesPorEstoque(@PathVariable Long idEstoque) {
        return validadeRepo.findByEstoqueIdOrderByDataValidadeAsc(idEstoque);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // VENDA — vendas de hoje e por período
    // GET /api/vendas/hoje
    // GET /api/vendas/periodo?inicio=2025-01-01&fim=2025-12-31
    // GET /api/vendas/paciente/{idPaciente}
    // ──────────────────────────────────────────────────────────────────────────

    @GetMapping("/vendas/hoje")
    public List<Venda> vendasHoje() {
        return vendaRepo.findVendasHoje();
    }

    @GetMapping("/vendas/periodo")
    public List<Venda> vendasPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return vendaRepo.findByDataBetweenOrderByDataDesc(
                inicio.atStartOfDay(),
                fim.atTime(23, 59, 59)
        );
    }

    @GetMapping("/vendas/paciente/{idPaciente}")
    public List<Venda> vendasPorPaciente(@PathVariable Long idPaciente) {
        return vendaRepo.findByPacienteId(idPaciente);
    }
}