package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "receita")
@Getter
@Setter
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_medico")
    private Long idMedico;

    @Column(name = "id_paciente")
    private Long idPaciente;

    @Column(length = 100)
    private String medicamento;

    @Column(length = 50)
    private String dosagem;

    @Column(length = 50)
    private String concentracao;

    @Column(length = 50)
    private String frequencia;

    @Column(length = 50)
    private String duracao;

    @Column(name = "via_administracao", length = 50)
    private String viaAdministracao;

    @Column(columnDefinition = "TEXT")
    private String instrucoes;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "data_prescricao", length = 20)
    private String dataPrescricao;

    @Column(length = 50)
    private String status;
}
