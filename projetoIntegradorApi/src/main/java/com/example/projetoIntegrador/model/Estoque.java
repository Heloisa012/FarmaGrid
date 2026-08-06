package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "estoque")
@Getter
@Setter
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_medicamento")
    private Medicamento medicamento;

    @ManyToOne
    @JoinColumn(name = "id_farmacia")
    private Farmacia farmacia;

    @Column(nullable = false, length = 150)
    private String nomeProduto;

    @Column(length = 50)
    private String categoria;

    @Column(name = "quantidade_atual", nullable = false)
    private Integer quantidadeAtual;

    @Column(name = "estoque_minimo", nullable = false)
    private Integer estoqueMinimo;

    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(length = 100)
    private String fornecedor;

    @Column(name = "data_fabricacao")
    private LocalDate dataFabricacao;

    @ManyToOne
    @JoinColumn(name = "id_status")
    private StatusEstoque status;
}