package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paciente")
@Getter
@Setter
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "data_nascimento", length = 20)
    private String dataNascimento;

    @Column(length = 10)
    private String sexo;

    @Column(length = 100)
    private String rua;

    @Column(name = "num_casa")
    private Integer numCasa;

    @Column(length = 100)
    private String bairro;

    @Column(name = "id_cidade")
    private Long idCidade;

    @Column(name = "id_plano")
    private Long idPlano;
}
