package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
@Getter
@Setter
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "id_farmacia", nullable = false)
    private Long idFarmacia;

    @Column(length = 100)
    private String categoria;

    private Integer quantidade;

    @Column(name = "estoque_min")
    private Integer estoqueMin;

    private BigDecimal preco;

    @Column(length = 150)
    private String fornecedor;

    @Column(name = "criado_em", insertable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "tarja_preta", nullable = false)
    private Boolean tarjaPreta;

    @Column(name = "codigo_barras", length = 50)
    private String codigoBarras;

    // ── Campos calculados (não persistidos), preenchidos pelo controller ──────
    @Transient
    private java.time.LocalDate proximaValidade;

    @Transient
    private Long totalLotes;
}
