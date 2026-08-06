package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "FarmaGrid_parceria")
@Getter
@Setter
public class Parceria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(name = "percentual_desconto", precision = 5, scale = 2)
    private java.math.BigDecimal percentualDesconto;

    @Column(name = "pacientes_encaminhados")
    private Integer pacientesEncaminhados;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "servicos_oferecidos", columnDefinition = "TEXT")
    private String servicosOferecidos;
}