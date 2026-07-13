package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Alergia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlergiaRepository extends JpaRepository<Alergia, Long> {
    Optional<Alergia> findByNomeIgnoreCase(String nome);
}
