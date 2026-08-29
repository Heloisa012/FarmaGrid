package com.example.projetoIntegrador.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cliente_farmacia")
@Getter
@Setter
public class ClienteFarmacia {

    @EmbeddedId
    private ClienteFarmaciaId id;
}