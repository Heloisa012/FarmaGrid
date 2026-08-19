package com.example.projetoIntegrador.dto;

import java.time.LocalDate;

// ── Lote + nome do produto, igual ao JOIN lotes/produtos do main.js ──────────
public class LoteComProdutoResponse {
    public Long id;
    public Long idProduto;
    public String numeroLote;
    public Integer quantidade;
    public LocalDate dataValidade;
    public String prateleira;
    public String nomeProduto;
}
