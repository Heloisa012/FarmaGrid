package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Teleconsulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeleconsultaRepository extends JpaRepository<Teleconsulta, Long> {
    boolean existsByIdMedicoAndIdPaciente(Long idMedico, Long idPaciente);

    @Query(value = "SELECT * FROM teleconsulta WHERE id_medico = :idMedico " +
            "ORDER BY STR_TO_DATE(data, '%d/%m/%Y') ASC, horario ASC", nativeQuery = true)
    List<Teleconsulta> findByIdMedicoOrderByData(@Param("idMedico") Long idMedico);

    List<Teleconsulta> findByIdPaciente(Long idPaciente);
    long countByIdPaciente(Long idPaciente);
}
