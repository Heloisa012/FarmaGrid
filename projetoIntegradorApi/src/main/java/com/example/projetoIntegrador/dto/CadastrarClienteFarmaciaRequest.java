package com.example.projetoIntegrador.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CadastrarClienteFarmaciaRequest {

    private String cpf;
    private String nome;
    private String telefone;
    private String email;
    private Long idFarmacia;
}