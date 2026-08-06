package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "farmacia")
@Getter
@Setter
public class Farmacia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, length = 18)
    private String cnpj;

    @Column(length = 10)
    private String cep;

    private Integer num;

    @Column(length = 20)
    private String telefone;

    @Column(name = "id_cidade")
    private Long idCidade;
}
