package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "plano_paciente")
@Getter
@Setter
public class PlanoPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_plano", nullable = false, length = 100)
    private String nomePlano;
}
