package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.CupomResgate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CupomResgateRepository extends JpaRepository<CupomResgate, Long> {
    boolean existsByIdPacienteAndIdCupom(Long idPaciente, Long idCupom);
    List<CupomResgate> findByIdPaciente(Long idPaciente);
}
