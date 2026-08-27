package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Funcionario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, String> {
    List<Funcionario> findByIdFarmacia(Long idFarmacia);
}
