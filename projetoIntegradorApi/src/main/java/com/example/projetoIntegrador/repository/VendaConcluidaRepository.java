package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.VendaConcluida;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaConcluidaRepository extends JpaRepository<VendaConcluida, String> {
    List<VendaConcluida> findByIdFarmacia(Long idFarmacia);
}
