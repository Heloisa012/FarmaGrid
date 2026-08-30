package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {

    List<Cupom> findByStatusAndIdFarmacia(String status, Long idFarmacia);
    Optional<Cupom> findByCodigo(String codigo);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Cupom c WHERE c.id = :id")
    Optional<Cupom> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT c FROM Cupom c WHERE c.status = 'ativo' ORDER BY c.codigo ASC")
    List<Cupom> findCuponsAtivos();

    @Query("SELECT c FROM Cupom c WHERE c.idFarmacia = :idFarmacia ORDER BY c.status ASC, c.codigo ASC")
    List<Cupom> findAllOrderByStatusAndCodigo(@Param("idFarmacia") Long idFarmacia);
}
