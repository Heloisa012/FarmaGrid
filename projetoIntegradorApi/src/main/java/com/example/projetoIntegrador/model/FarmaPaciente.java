package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "`FarmaPacientes`")
@Getter
@Setter
public class FarmaPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 70)
    private String nome;

    private Integer idade;

    @Column(length = 100)
    private String condicao;

    @Column(name = "ultima_visita", length = 45)
    private String ultimaVisita;
}
