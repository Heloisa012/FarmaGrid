package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Validade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ValidadeRepository extends JpaRepository<Validade, Long> {
    List<Validade> findByEstoqueIdOrderByDataValidadeAsc(Long idEstoque);
}
