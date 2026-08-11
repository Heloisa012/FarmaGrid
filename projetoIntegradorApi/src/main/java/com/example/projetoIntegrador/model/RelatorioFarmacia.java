package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "relatorios_farmacia")
@Getter
@Setter
public class RelatorioFarmacia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(length = 50)
    private String periodo;

    @Column(nullable = false, length = 10)
    private String formato;

    @Column(name = "nome_arquivo", nullable = false, length = 255)
    private String nomeArquivo;

    @Column(nullable = false, length = 500)
    private String caminho;

    @Column(name = "tamanho_kb")
    private Integer tamanhoKb;

    @Column(name = "gerado_em", insertable = false, updatable = false)
    private LocalDateTime geradoEm;
}
