package com.example.projetoIntegrador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "relatorios")
@Getter
@Setter
public class Relatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_paciente", nullable = false)
    private Long idPaciente;

    @Column(length = 255)
    private String titulo;

    @Column(length = 100)
    private String tipo;

    @Column(length = 50)
    private String data;

    @Lob
    @Column(name = "arquivo")
    @JsonIgnore
    private byte[] arquivo;
}
