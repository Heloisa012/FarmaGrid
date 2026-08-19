package com.example.projetoIntegrador.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paciente_alergia")
@Getter
@Setter
public class PacienteAlergia {

    @EmbeddedId
    private PacienteAlergiaId id;
}
