package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Desconto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DescontoRepository extends JpaRepository<Desconto, Long> {

    Optional<Desconto> findByNomeCupom(String nomeCupom);

    @Query("""
        SELECT d FROM Desconto d
        WHERE d.nomeCupom = :cupom
          AND d.status = 'ATIVO'
          AND d.validoAte >= CURRENT_DATE
          AND (d.limiteUsos IS NULL OR d.usosRealizados < d.limiteUsos)
    """)
    Optional<Desconto> findCupomValido(@Param("cupom") String cupom);
}
