package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Relatorio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RelatorioRepository extends JpaRepository<Relatorio, Long> {
    List<Relatorio> findByIdPaciente(Long idPaciente);
}
