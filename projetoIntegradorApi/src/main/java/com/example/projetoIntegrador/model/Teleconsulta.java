package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "teleconsulta")
@Getter
@Setter
public class Teleconsulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_medico", nullable = false)
    private Long idMedico;

    @Column(name = "id_paciente", nullable = false)
    private Long idPaciente;

    @Column(nullable = false, length = 20)
    private String data;

    @Column(nullable = false, length = 20)
    private String horario;

    @Column(length = 50)
    private String status;

    @Column(length = 20)
    private String duracao;

    @Column(length = 50)
    private String tipo;

    @Column(name = "nomePaciente", length = 255)
    private String nomePaciente;
}
