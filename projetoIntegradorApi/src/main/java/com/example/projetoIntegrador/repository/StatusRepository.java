package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Long> {
}
