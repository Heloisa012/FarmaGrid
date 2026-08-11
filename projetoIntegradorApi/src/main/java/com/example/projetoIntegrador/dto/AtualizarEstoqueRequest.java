package com.example.projetoIntegrador.dto;

// ── POST /api/lotes (entrada/saída de estoque + registro de lote) ────────────
public class AtualizarEstoqueRequest {
    public Long idProduto;
    public String tipo; // "entrada" ou "saida"
    public Integer quantidade;
    public String numeroLote;
    public java.time.LocalDate dataValidade;
    public String prateleira;
}
