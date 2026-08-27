package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findAllByOrderByNomeAsc();
    List<Produto> findAllByIdFarmaciaOrderByNomeAsc(Long idFarmacia);

    Optional<Produto> findByCodigoBarras(String codigoBarras);

    @Query("SELECT p FROM Produto p WHERE p.idFarmacia = :idFarmacia AND p.quantidade < p.estoqueMin ORDER BY p.quantidade ASC")
    List<Produto> findEstoqueBaixo(@Param("idFarmacia") Long idFarmacia);
}
