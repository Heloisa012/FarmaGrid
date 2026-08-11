package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CupomRepository extends JpaRepository<Cupom, Long> {

    List<Cupom> findByStatus(String status);

    @Query("SELECT c FROM Cupom c ORDER BY c.status ASC, c.codigo ASC")
    List<Cupom> findAllOrderByStatusAndCodigo();
}
