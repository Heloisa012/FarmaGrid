package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Column(unique = true, length = 20)
    private String cpf;

    private Integer idade;

    @Column(name = "data_nascimento", length = 20)
    private String dataNascimento;

    @Column(length = 10)
    private String sexo;

    @Column(length = 100)
    private String rua;

    @Column(name = "num_casa")
    private Integer numCasa;

    @Column(length = 100)
    private String bairro;

    @Column(name = "id_cidade")
    private Long idCidade;

    @Column(name = "id_plano")
    private Long idPlano;

    @Column(length = 20)
    private String telefone;

    @Column(length = 9)
    private String cep;

    @Column(name = "tipo_sanguineo", length = 3)
    private String tipoSanguineo;

    @Column(name = "contato_emergencia_nome", length = 100)
    private String contatoEmergenciaNome;

    @Column(name = "contato_emergencia_telefone", length = 20)
    private String contatoEmergenciaTelefone;

    @Column(length = 100)
    private String cidade;

    @Column(name = "plano_saude", length = 100)
    private String planoSaude;

    @Lob
    @JdbcTypeCode(SqlTypes.LONGVARBINARY)
    @Column(name = "foto_perfil", columnDefinition = "LONGBLOB")
    private byte[] fotoPerfil;
}
