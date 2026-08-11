package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
}
