package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.VendaConcluida;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaConcluidaRepository extends JpaRepository<VendaConcluida, String> {
}
