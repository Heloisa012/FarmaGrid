package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.Cupom;
import com.example.projetoIntegrador.model.CupomResgate;
import com.example.projetoIntegrador.repository.CupomRepository;
import com.example.projetoIntegrador.repository.CupomResgateRepository;
import com.example.projetoIntegrador.repository.PacienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/pacientes/{idPaciente}/cupons")
public class CupomPacienteController {
    private final CupomRepository cupons;
    private final CupomResgateRepository resgates;
    private final PacienteRepository pacientes;

    public CupomPacienteController(CupomRepository cupons, CupomResgateRepository resgates,
                                   PacienteRepository pacientes) {
        this.cupons = cupons;
        this.resgates = resgates;
        this.pacientes = pacientes;
    }

    @GetMapping
    public ResponseEntity<?> listar(@PathVariable Long idPaciente) {
        if (!pacientes.existsById(idPaciente)) return ResponseEntity.notFound().build();
        Set<Long> resgatados = new HashSet<>();
        resgates.findByIdPaciente(idPaciente).forEach(r -> resgatados.add(r.getIdCupom()));
        return ResponseEntity.ok(cupons.findCuponsAtivos().stream()
            .filter(this::disponivel)
            .map(c -> resposta(c, resgatados.contains(c.getId())))
            .toList());
    }

    @PostMapping("/{idCupom}/resgatar")
    @Transactional
    public ResponseEntity<?> resgatar(@PathVariable Long idPaciente, @PathVariable Long idCupom) {
        if (!pacientes.existsById(idPaciente)) return ResponseEntity.notFound().build();
        Cupom cupom = cupons.findByIdForUpdate(idCupom).orElse(null);
        if (cupom == null) return ResponseEntity.notFound().build();
        if (resgates.existsByIdPacienteAndIdCupom(idPaciente, idCupom)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Este cupom já foi resgatado por você."));
        }
        if (!disponivel(cupom)) {
            cupom.setStatus("expirado");
            cupons.save(cupom);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Este cupom não está mais disponível."));
        }
        int usos = Optional.ofNullable(cupom.getUsosAtuais()).orElse(0) + 1;
        cupom.setUsosAtuais(usos);
        if (cupom.getLimiteUso() != null && cupom.getLimiteUso() > 0 && usos >= cupom.getLimiteUso()) {
            cupom.setStatus("expirado");
        }
        cupons.save(cupom);
        CupomResgate resgate = new CupomResgate();
        resgate.setIdPaciente(idPaciente);
        resgate.setIdCupom(idCupom);
        resgate.setResgatadoEm(LocalDateTime.now());
        resgates.save(resgate);
        return ResponseEntity.ok(resposta(cupom, true));
    }

    private boolean disponivel(Cupom c) {
        int usos = Optional.ofNullable(c.getUsosAtuais()).orElse(0);
        return (c.getStatus() == null || "ativo".equalsIgnoreCase(c.getStatus()))
            && (c.getValidade() == null || !c.getValidade().isBefore(LocalDate.now()))
            && (c.getLimiteUso() == null || c.getLimiteUso() <= 0 || usos < c.getLimiteUso());
    }

    private Map<String, Object> resposta(Cupom c, boolean resgatado) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", c.getId()); item.put("codigo", c.getCodigo());
        item.put("descricao", c.getDescricao()); item.put("tipo", c.getTipo());
        item.put("valor", c.getValor()); item.put("validade", c.getValidade());
        item.put("status", c.getStatus()); item.put("idFarmacia", c.getIdFarmacia());
        item.put("limiteUso", c.getLimiteUso()); item.put("usosAtuais", c.getUsosAtuais());
        item.put("resgatado", resgatado);
        return item;
    }
}
