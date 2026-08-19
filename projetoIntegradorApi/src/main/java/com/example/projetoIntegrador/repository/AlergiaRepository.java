package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Alergia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlergiaRepository extends JpaRepository<Alergia, Long> {
}
