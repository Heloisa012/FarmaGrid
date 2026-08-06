package com.example.projetoIntegrador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paciente_alergia", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_paciente", "id_alergia"})
})
@Getter
@Setter
public class PacienteAlergia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnore
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_alergia", nullable = false)
    private Alergia alergia;

    @Column(columnDefinition = "TEXT")
    private String observacao;
}
