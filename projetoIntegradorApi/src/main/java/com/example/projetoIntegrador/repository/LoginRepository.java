package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, Long> {
    Optional<Login> findByEmailAndTipo(String email, Integer tipo);
    Optional<Login> findByIdMedico(Long idMedico);
    Optional<Login> findByIdPaciente(Long idPaciente);
    boolean existsByEmailAndIdNot(String email, Long id);
}
