package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Teleconsulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeleconsultaRepository extends JpaRepository<Teleconsulta, Long> {
    List<Teleconsulta> findByMedicoIdOrderByDataAscHorarioAsc(Long idMedico);
    List<Teleconsulta> findByPacienteId(Long idPaciente);
}
