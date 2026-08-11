package com.example.projetoIntegrador.dto;

import java.time.LocalTime;

// ── PUT /api/medicos/{id}/preferencias ────────────────────────────────────────
public class MedicoPreferenciasRequest {
    public LocalTime horarioInicio;
    public LocalTime horarioTermino;
}
