package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "medico")
@Getter
@Setter
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 100)
    private String sobrenome;

    @Column(length = 20)
    private String crm;

    @Column(length = 100)
    private String especialidade;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 255)
    private String endereco;

    @Lob
    @JdbcTypeCode(SqlTypes.LONGVARBINARY)
    @Column(name = "foto_perfil")
    private byte[] fotoPerfil;

    @Column(length = 20)
    private String rqe;

    @Column(length = 255)
    private String subespecialidades;

    @Column(name = "horario_inicio")
    private LocalTime horarioInicio;

    @Column(name = "horario_termino")
    private LocalTime horarioTermino;

    @Column(name = "tipo_atendimento", length = 50)
    private String tipoAtendimento;
}
