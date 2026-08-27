package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {

    List<Cupom> findByStatusAndIdFarmacia(String status, Long idFarmacia);
    Optional<Cupom> findByCodigo(String codigo);

    @Query("SELECT c FROM Cupom c WHERE c.idFarmacia = :idFarmacia ORDER BY c.status ASC, c.codigo ASC")
    List<Cupom> findAllOrderByStatusAndCodigo(@Param("idFarmacia") Long idFarmacia);
}