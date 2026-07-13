package com.example.projetoIntegrador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.YearMonth;

@Entity
@Table(name = "cartao")
@Getter
@Setter
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnore
    private Paciente paciente;

    @Column(name = "nome_titular", nullable = false, length = 100)
    private String nomeTitular;

    // Apenas os 4 últimos dígitos são armazenados por segurança (PCI-DSS).
    // O número completo é tratado pelo gateway de pagamento via token_pagamento.
    @Column(name = "ultimos_digitos", nullable = false, length = 4)
    private String ultimosDigitos;

    @Column(name = "validade")
    private YearMonth validade;

    @Column(nullable = false, length = 20)
    private String bandeira;

    @Column(name = "token_pagamento", nullable = false, length = 255)
    private String tokenPagamento;
}
