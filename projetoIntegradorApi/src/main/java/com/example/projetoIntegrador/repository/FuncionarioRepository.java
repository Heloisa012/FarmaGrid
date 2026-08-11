package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, String> {
}
