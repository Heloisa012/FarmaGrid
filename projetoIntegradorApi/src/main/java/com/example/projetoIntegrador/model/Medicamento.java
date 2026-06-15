package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicamento")
@Getter
@Setter
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 50)
    private String fabricante;

    @Column(name = "principio_ativo", columnDefinition = "TEXT")
    private String principioAtivo;

    @Column(length = 50)
    private String dosagem;

    @Column(name = "forma_farmaceutica", length = 20)
    private String formaFarmaceutica;

    @Column(length = 50)
    private String categoria;

    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(length = 100)
    private String fornecedor;

    @Column(name = "data_fabricacao")
    private LocalDate dataFabricacao;

    @Column(name = "data_validade")
    private LocalDate dataValidade;
}