package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
}
