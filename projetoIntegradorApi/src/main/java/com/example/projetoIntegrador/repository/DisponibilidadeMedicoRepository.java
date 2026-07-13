package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.DisponibilidadeMedico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisponibilidadeMedicoRepository extends JpaRepository<DisponibilidadeMedico, Long> {
    List<DisponibilidadeMedico> findByMedicoId(Long idMedico);
}
