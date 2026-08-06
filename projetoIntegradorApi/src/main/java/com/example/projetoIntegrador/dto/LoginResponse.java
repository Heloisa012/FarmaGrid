package com.example.projetoIntegrador.dto;

public class LoginResponse {
    public String token;
    public String tipo;
    public String nome;

    public LoginResponse(String token, String tipo, String nome) {
        this.token = token;
        this.tipo  = tipo;
        this.nome  = nome;
    }
}
