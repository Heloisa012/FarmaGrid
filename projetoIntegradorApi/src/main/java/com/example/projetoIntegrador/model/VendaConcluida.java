package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "vendas_concluidas")
@Getter
@Setter
public class VendaConcluida {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "id_farmacia", nullable = false)
    private Long idFarmacia;

    @Column(length = 255)
    private String cliente;

    private BigDecimal total;

    private Integer quantidade;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    private BigDecimal troco;

    @Column(name = "data_venda", length = 20)
    private String dataVenda;

    @Lob
    @Column(name = "produtos")
    private String produtos;
}
