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

    @Column(name = "id_medico")
    private Long idMedico;

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

    @Column(name = "cid10", length = 20)
    private String cid10;

    @Column(columnDefinition = "TEXT")
    private String anamnese;

    @Column(name = "exame_fisico", columnDefinition = "TEXT")
    private String exameFisico;

    @Column(columnDefinition = "TEXT")
    private String conduta;

    @Column(name = "data_retorno", length = 20)
    private String dataRetorno;

    @Column(length = 20)
    private String pa;

    @Column(length = 20)
    private String temperatura;

    @Column(length = 20)
    private String peso;

    @Column(length = 20)
    private String spo2;

    @Column(columnDefinition = "TEXT")
    private String notas;
}
