package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "lotes")
@Getter
@Setter
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_produto", nullable = false)
    private Long idProduto;

    @Column(name = "numero_lote", length = 50)
    private String numeroLote;

    private Integer quantidade;

    @Column(name = "data_validade")
    private LocalDate dataValidade;

    @Column(length = 50)
    private String prateleira;
}
