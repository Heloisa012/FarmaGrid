package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataBetweenOrderByDataDesc(LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT v FROM Venda v WHERE DATE(v.data) = CURRENT_DATE ORDER BY v.data DESC")
    List<Venda> findVendasHoje();

    List<Venda> findByPacienteId(Long idPaciente);
}
