package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.PacienteAlergia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PacienteAlergiaRepository extends JpaRepository<PacienteAlergia, Long> {
    List<PacienteAlergia> findByPacienteId(Long idPaciente);
}
