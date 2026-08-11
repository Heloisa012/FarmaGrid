package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "parceiros")
@Getter
@Setter
public class Parceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String parceiro;

    @Column(length = 50)
    private String tipo;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(precision = 5, scale = 2)
    private BigDecimal desconto;

    private Integer encaminhamentos;

    @Column(length = 20)
    private String status;

    @Column(name = "dataInicio", length = 20)
    private String dataInicio;
}
