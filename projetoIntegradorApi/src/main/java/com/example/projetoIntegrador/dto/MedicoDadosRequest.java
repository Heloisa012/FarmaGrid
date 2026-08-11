package com.example.projetoIntegrador.dto;

import java.time.LocalDate;

// ── PUT /api/medicos/{id} (dados pessoais) ────────────────────────────────────
public class MedicoDadosRequest {
    public String nome;
    public String sobrenome;
    public String email;
    public String telefone;
    public LocalDate dataNascimento;
    public String endereco;
}
