package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "teleconsulta")
@Getter
@Setter
public class Teleconsulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_medico")
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private LocalTime horario;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    @Column(length = 50)
    private String tipo;

    @ManyToOne
    @JoinColumn(name = "id_status")
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String relatorio;
}