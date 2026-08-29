package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.ClienteFarmacia;
import com.example.projetoIntegrador.model.ClienteFarmaciaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteFarmaciaRepository
        extends JpaRepository<ClienteFarmacia, ClienteFarmaciaId> {
}