package com.example.projetoIntegrador.model;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class PacienteAlergiaId implements Serializable {

    private Long idPaciente;
    private Long idAlergia;
}
