package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "solicitacao_exame")
@Getter @Setter
public class SolicitacaoExame {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "id_paciente", nullable = false) private Long idPaciente;
    @Column(name = "id_medico") private Long idMedico;
    @Column(nullable = false, length = 150) private String exame;
    @Column(columnDefinition = "TEXT") private String justificativa;
    @Column(nullable = false, length = 20) private String status;
    @Column(name = "solicitado_em", nullable = false, length = 20) private String solicitadoEm;
    @Column(name = "nome_medico", length = 150) private String nomeMedico;
}
