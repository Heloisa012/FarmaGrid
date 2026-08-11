package com.example.projetoIntegrador.dto;

import java.math.BigDecimal;

// ── PUT /api/medicos/{id}/profissional (dados profissionais + clínica) ───────
public class MedicoProfissionalRequest {
    public String crm;
    public String rqe;
    public String especialidade;
    public String subespecialidades;
    public String tipoAtendimento;

    public String nomeClinica;
    public String enderecoClinica;
    public String tempoConsulta;
    public BigDecimal valorConsulta;
}
