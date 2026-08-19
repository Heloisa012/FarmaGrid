package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "prontuario")
@Getter
@Setter
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_paciente", nullable = false)
    private Long idPaciente;

    @Column(name = "nome_paciente", nullable = false, length = 100)
    private String nomePaciente;

    private Integer idade;

    @Column(length = 255)
    private String condicao;

    @Column(name = "ultima_visita", length = 50)
    private String ultimaVisita;

    @Column(length = 50)
    private String status;

    @Column(length = 100)
    private String tipo;

    @Column(columnDefinition = "TEXT")
    private String notas;
}
