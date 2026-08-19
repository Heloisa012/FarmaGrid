package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.RelatorioFarmacia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RelatorioFarmaciaRepository extends JpaRepository<RelatorioFarmacia, Long> {
    List<RelatorioFarmacia> findTop10ByOrderByGeradoEmDesc();
}
