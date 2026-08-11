package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "`funcFarma`")
@Getter
@Setter
public class Funcionario {

    @Id
    @Column(name = "CPF", length = 14)
    private String cpf;

    @Column(nullable = false, length = 80)
    private String nome;

    @Column(nullable = false, length = 45)
    private String email;

    @Column(nullable = false, length = 45)
    private String telefone;

    @Column(nullable = false, length = 45)
    private String funcao;

    @Column(nullable = false, length = 45)
    private String status;
}
