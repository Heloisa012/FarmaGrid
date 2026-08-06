package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "desconto")
@Getter
@Setter
public class Desconto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_cupom", nullable = false, length = 50, unique = true)
    private String nomeCupom;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDesconto;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    // "TODOS" ou "ESPECIFICOS"
    @Column(nullable = false, length = 20)
    private String categoria;

    // "PERCENTUAL" ou "DINHEIRO"
    @Column(name = "tipo_desconto", nullable = false, length = 20)
    private String tipoDesconto;

    @Column(name = "valido_ate", nullable = false)
    private LocalDate validoAte;

    @Column(name = "limite_usos")
    private Integer limiteUsos;

    @Column(name = "usos_realizados", nullable = false)
    private Integer usosRealizados = 0;

    // "ATIVO" ou "EXPIRADO"
    @Column(nullable = false, length = 20)
    private String status;
}