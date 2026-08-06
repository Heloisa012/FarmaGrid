package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByCrm(String crm);
}

