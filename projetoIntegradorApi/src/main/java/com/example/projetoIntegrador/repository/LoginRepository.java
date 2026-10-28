package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

public interface LoginRepository extends JpaRepository<Login, Long> {
    java.util.List<Login> findAllByEmailIgnoreCase(String email);
    Optional<Login> findByEmailAndTipo(String email, Integer tipo);
    Optional<Login> findByIdMedico(Long idMedico);
    Optional<Login> findByIdPaciente(Long idPaciente);
    Optional<Login> findByIdBalconistaOrIdCaixa( String idBalconista, String idCaixa);
    boolean existsByEmailAndIdNot(String email, Long id);


    // dentro da interface:
    @Query("select count(distinct l.idFarmacia) from Login l where l.idFarmacia is not null")
    long contarFarmacias();
}
