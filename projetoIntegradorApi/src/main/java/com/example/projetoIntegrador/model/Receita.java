package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "receita")
@Getter
@Setter
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_medicamento")
    private Medicamento medicamento;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(length = 50)
    private String dosagem;

    private Integer frequencia;

    private Integer duracao;

    @Column(length = 30)
    private String status;

    @ManyToOne
    @JoinColumn(name = "id_consulta")
    private Teleconsulta consulta;
}