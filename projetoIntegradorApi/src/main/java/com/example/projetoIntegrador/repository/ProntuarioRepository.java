package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
}
