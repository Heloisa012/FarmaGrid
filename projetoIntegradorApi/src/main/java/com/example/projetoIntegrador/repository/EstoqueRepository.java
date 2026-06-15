package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstoqueRepository extends JpaRepository<Estoque, Long> {
}
