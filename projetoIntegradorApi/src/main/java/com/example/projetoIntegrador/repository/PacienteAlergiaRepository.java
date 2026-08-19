package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.PacienteAlergia;
import com.example.projetoIntegrador.model.PacienteAlergiaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PacienteAlergiaRepository extends JpaRepository<PacienteAlergia, PacienteAlergiaId> {
    List<PacienteAlergia> findByIdIdPaciente(Long idPaciente);
}
