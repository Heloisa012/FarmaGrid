package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cupons")
@Getter
@Setter
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(name = "limite_uso")
    private Integer limiteUso;

    @Column(name = "usos_atuais")
    private Integer usosAtuais;

    private LocalDate validade;

    @Column(length = 20)
    private String status;
}
