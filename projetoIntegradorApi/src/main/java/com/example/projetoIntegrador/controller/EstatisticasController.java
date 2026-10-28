package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.repository.LoginRepository;
import com.example.projetoIntegrador.repository.MedicoRepository;
import com.example.projetoIntegrador.repository.PacienteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/estatisticas")
public class EstatisticasController {

    private final PacienteRepository pacienteRepo;
    private final MedicoRepository medicoRepo;
    private final LoginRepository loginRepo;

    public EstatisticasController(PacienteRepository pacienteRepo,
                                  MedicoRepository medicoRepo,
                                  LoginRepository loginRepo) {
        this.pacienteRepo = pacienteRepo;
        this.medicoRepo = medicoRepo;
        this.loginRepo = loginRepo;
    }

    @GetMapping
    public Map<String, Long> resumo() {
        return Map.of(
                "pacientes", pacienteRepo.count(),
                "medicos", medicoRepo.count(),
                "farmacias", loginRepo.contarFarmacias()
        );
    }
}