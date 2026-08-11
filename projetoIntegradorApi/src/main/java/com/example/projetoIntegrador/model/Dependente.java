package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dependente")
@Getter
@Setter
public class Dependente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_paciente", nullable = false)
    private Long idPaciente;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 14)
    private String cpf;

    @Column(length = 50)
    private String parentesco;
}
