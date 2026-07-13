package com.example.projetoIntegrador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(name = "disponibilidade_medico")
@Getter
@Setter
public class DisponibilidadeMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnore
    private Medico medico;

    // Ex: SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
    @Column(name = "dia_semana", nullable = false, length = 10)
    private String diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fim", nullable = false)
    private LocalTime horaFim;
}
