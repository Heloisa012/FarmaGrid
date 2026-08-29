package com.example.projetoIntegrador.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class ClienteFarmaciaId implements Serializable {

    @Column(name = "cpf_cliente", length = 14)
    private String cpfCliente;

    @Column(name = "id_farmacia")
    private Long idFarmacia;
}