package com.example.projetoIntegrador.dto;

import java.time.LocalDate;

public class CadastroRequest {

    // ── Dados de acesso (obrigatório para todos) ──────────────────────────────
    public String email;
    public String senha;

    // Tipos aceitos: PACIENTE, CLIENTE_FARMACIA, MEDICO, FUNCIONARIO, ADMIN
    public String tipo;

    // ── Dados pessoais comuns ─────────────────────────────────────────────────
    public String nome;
    public String cpf;
    public String telefone;

    // ── Só para PACIENTE ──────────────────────────────────────────────────────
    public String sexo;
    public LocalDate dataNascimento;
    public String rua;
    public Integer numCasa;
    public String bairro;

    // ── Só para MEDICO ────────────────────────────────────────────────────────
    public String crm;
    public String especialidade;
    public String clinica;

    // ── Só para FUNCIONARIO ───────────────────────────────────────────────────
    // turno: MANHA, TARDE, NOITE
    public String turno;
}
