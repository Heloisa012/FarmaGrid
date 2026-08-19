package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.MedicoClinica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicoClinicaRepository extends JpaRepository<MedicoClinica, Long> {
    Optional<MedicoClinica> findByIdMedico(Long idMedico);
}
