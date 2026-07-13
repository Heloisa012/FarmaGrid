package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Dependente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DependenteRepository extends JpaRepository<Dependente, Long> {
    List<Dependente> findByPacienteId(Long idPaciente);
}
