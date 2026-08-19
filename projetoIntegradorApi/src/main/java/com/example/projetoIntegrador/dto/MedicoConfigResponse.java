package com.example.projetoIntegrador.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

// ── Junta medico + medico_clinica, igual ao SELECT com LEFT JOIN do main.js ──
public class MedicoConfigResponse {
    public Long id;
    public String nome;
    public String sobrenome;
    public String crm;
    public String especialidade;
    public String email;
    public String telefone;
    public LocalDate dataNascimento;
    public String endereco;
    public byte[] fotoPerfil;
    public String rqe;
    public String subespecialidades;
    public LocalTime horarioInicio;
    public LocalTime horarioTermino;
    public String tipoAtendimento;

    public String nomeClinica;
    public String enderecoClinica;
    public String tempoConsulta;
    public BigDecimal valorConsulta;
}
