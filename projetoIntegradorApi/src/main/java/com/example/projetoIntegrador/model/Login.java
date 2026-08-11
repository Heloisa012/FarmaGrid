package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "login")
@Getter
@Setter
public class Login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String senha;

    @JdbcTypeCode(SqlTypes.TINYINT)
    @Column(nullable = false)
    private Integer tipo;

    @Column(name = "id_medico")
    private Long idMedico;

    @Column(name = "id_farmacia")
    private Long idFarmacia;

    @Column(name = "id_balconista")
    private Long idBalconista;

    @Column(name = "id_caixa")
    private Long idCaixa;
}
