package com.example.projetoIntegrador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "dependente")
@Getter
@Setter
public class Dependente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnore
    private Paciente paciente;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 14)
    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(nullable = false, length = 50)
    private String parentesco;
}
