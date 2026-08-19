package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "medico_clinica")
@Getter
@Setter
public class MedicoClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_medico", nullable = false)
    private Long idMedico;

    @Column(name = "nome_clinica", length = 150)
    private String nomeClinica;

    @Column(name = "endereco_clinica", length = 255)
    private String enderecoClinica;

    @Column(name = "tempo_consulta", length = 20)
    private String tempoConsulta;

    @Column(name = "valor_consulta", precision = 10, scale = 2)
    private BigDecimal valorConsulta;
}
