package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "FarmaPacientes")
@Getter
@Setter
public class FarmaPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 70)
    private String nome;

    private Integer idade;

    @Column(length = 100)
    private String condicao;

    @Column(name = "ultimaVisita", length = 45)
    private String ultimaVisita;
}
