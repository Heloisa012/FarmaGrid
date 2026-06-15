package com.example.projetoIntegrador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "paciente")
@Getter
@Setter
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 14, unique = true)
    private String cpf;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false, length = 10)
    private String sexo;

    @Column(nullable = false)
    private String rua;

    @Column(name = "num_casa", nullable = false)
    private Integer numCasa;

    @Column(nullable = false)
    private String bairro;

    @Column(name = "id_cidade")
    private Long idCidade;

    @Column(length = 20)
    private String telefone;

    @Column(length = 100)
    private String email;

    @Column(name = "condicao", columnDefinition = "TEXT")
    private String condicao;

    @Column(name = "ultima_visita")
    private LocalDate ultimaVisita;

    @ManyToOne
    @JoinColumn(name = "id_plano")
    private PlanoPaciente plano;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Teleconsulta> teleconsultas;
}