package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    List<Prontuario> findByIdPacienteOrderByIdDesc(Long idPaciente);
    Optional<Prontuario> findFirstByIdPacienteOrderByIdDesc(Long idPaciente);
    long countByIdPaciente(Long idPaciente);
    List<Prontuario> findByIdMedicoOrderByIdDesc(Long idMedico);
}
