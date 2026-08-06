package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "validade")
@Getter
@Setter
public class Validade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_lote", nullable = false, length = 50)
    private String numeroLote;

    @ManyToOne
    @JoinColumn(name = "id_estoque")
    private Estoque estoque;

    @Column(name = "localizacao_prateleira", length = 100)
    private String localizacaoPrateleira;

    @Column(name = "data_validade", nullable = false)
    private LocalDate dataValidade;
}