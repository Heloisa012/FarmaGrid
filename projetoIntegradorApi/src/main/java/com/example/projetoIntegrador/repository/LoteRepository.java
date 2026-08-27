package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LoteRepository extends JpaRepository<Lote, Long> {

    List<Lote> findByIdProdutoOrderByDataValidadeAsc(Long idProduto);
    List<Lote> findAllByOrderByDataValidadeAsc();

    @Query("SELECT l FROM Lote l WHERE l.idProduto IN (SELECT p.id FROM Produto p WHERE p.idFarmacia = :idFarmacia) ORDER BY l.dataValidade ASC")
    List<Lote> findAllByFarmaciaOrderByDataValidadeAsc(@Param("idFarmacia") Long idFarmacia);

    @Query("SELECT MIN(l.dataValidade) FROM Lote l WHERE l.idProduto = :idProduto")
    LocalDate proximaValidade(@Param("idProduto") Long idProduto);

    @Query("SELECT COALESCE(SUM(l.quantidade), 0) FROM Lote l WHERE l.idProduto = :idProduto")
    Long totalLotes(@Param("idProduto") Long idProduto);
}
