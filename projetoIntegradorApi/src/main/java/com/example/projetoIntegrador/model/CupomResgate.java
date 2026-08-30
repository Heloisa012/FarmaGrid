package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupom_resgate", uniqueConstraints = @UniqueConstraint(
    name = "uk_cupom_resgate_paciente_cupom", columnNames = {"id_paciente", "id_cupom"}))
@Getter @Setter
public class CupomResgate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "id_paciente", nullable = false)
    private Long idPaciente;
    @Column(name = "id_cupom", nullable = false)
    private Long idCupom;
    @Column(name = "resgatado_em", nullable = false)
    private LocalDateTime resgatadoEm;
}
