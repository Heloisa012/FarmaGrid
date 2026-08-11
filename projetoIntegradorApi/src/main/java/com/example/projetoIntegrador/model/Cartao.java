package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cartao")
@Getter
@Setter
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_paciente", nullable = false)
    private Long idPaciente;

    @Column(name = "nome_titular", length = 100)
    private String nomeTitular;

    @Column(length = 25)
    private String numero;

    @Column(length = 7)
    private String validade;

    @Column(length = 20)
    private String bandeira;

    @Column(name = "token_pagamento", length = 255)
    private String tokenPagamento;
}
