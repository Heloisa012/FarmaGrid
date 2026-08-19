package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByIdPaciente(Long idPaciente);
}
