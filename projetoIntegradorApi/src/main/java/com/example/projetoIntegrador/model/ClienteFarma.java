package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "clienteFarma")
@Getter
@Setter
public class ClienteFarma {

    @Id
    @Column(name = "CPF", length = 20)
    private String cpf;

    @Column(nullable = false, length = 80)
    private String nome;

    @Column(nullable = false, length = 45)
    private String telefone;

    @Column(nullable = false, length = 45)
    private String email;
}
