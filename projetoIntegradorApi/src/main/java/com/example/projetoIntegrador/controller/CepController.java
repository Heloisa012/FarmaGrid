package com.example.projetoIntegrador.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Proxy para a API pública ViaCEP (viacep.com.br).
 *
 * Rotas:
 *   GET  /api/cep/{cep}                          → endereço pelo CEP
 *   GET  /api/cep/busca?uf=SP&cidade=Campinas&rua=Flores  → CEPs pelo endereço
 *
 * O endpoint é liberado sem autenticação no SecurityConfig para que o formulário
 * de cadastro/login possa usá-lo antes do usuário ter um token.
 */
@RestController
@RequestMapping("/api/cep")
public class CepController {

    private static final String VIACEP_BASE = "https://viacep.com.br/ws";

    private final RestTemplate restTemplate = new RestTemplate();

    // ──────────────────────────────────────────────────────────────────────────
    // Busca por CEP  →  GET /api/cep/{cep}
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/{cep}")
    public ResponseEntity<?> buscarPorCep(@PathVariable String cep) {
        String cepLimpo = cep.replaceAll("\\D", "");
        if (cepLimpo.length() != 8) {
            return ResponseEntity.badRequest().body(Map.of("erro", "CEP inválido. Informe exatamente 8 dígitos."));
        }

        try {
            URI uri = URI.create(VIACEP_BASE + "/" + cepLimpo + "/json/");
            @SuppressWarnings("unchecked")
            Map<String, Object> resposta = restTemplate.getForObject(uri, Map.class);

            if (resposta == null || resposta.containsKey("erro")) {
                return ResponseEntity.status(404).body(Map.of("erro", "CEP não encontrado."));
            }

            // Retorna apenas os campos relevantes para o formulário
            return ResponseEntity.ok(Map.of(
                "cep",      formatarCep(cepLimpo),
                "logradouro", nvl(resposta.get("logradouro")),
                "bairro",   nvl(resposta.get("bairro")),
                "cidade",   nvl(resposta.get("localidade")),
                "estado",   nvl(resposta.get("uf")),
                "ibge",     nvl(resposta.get("ibge"))
            ));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("erro", "Falha ao consultar ViaCEP: " + e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Busca por endereço  →  GET /api/cep/busca?uf=SP&cidade=Campinas&rua=Flores
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/busca")
    public ResponseEntity<?> buscarPorEndereco(
            @RequestParam String uf,
            @RequestParam String cidade,
            @RequestParam String rua) {

        if (uf.isBlank() || cidade.isBlank() || rua.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Informe uf, cidade e rua."));
        }

        try {
            // ViaCEP exige no mínimo 3 caracteres em cada campo
            String ufEnc    = encodeSegmento(uf.trim());
            String cidadeEnc = encodeSegmento(cidade.trim());
            String ruaEnc   = encodeSegmento(rua.trim());

            URI uri = URI.create(VIACEP_BASE + "/" + ufEnc + "/" + cidadeEnc + "/" + ruaEnc + "/json/");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> lista = restTemplate.getForObject(uri, List.class);

            if (lista == null || lista.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("erro", "Nenhum endereço encontrado."));
            }

            List<Map<String, Object>> resultados = lista.stream().map(item -> Map.<String, Object>of(
                "cep",        formatarCep(nvl(item.get("cep")).replace("-", "")),
                "logradouro", nvl(item.get("logradouro")),
                "bairro",     nvl(item.get("bairro")),
                "cidade",     nvl(item.get("localidade")),
                "estado",     nvl(item.get("uf"))
            )).toList();

            return ResponseEntity.ok(resultados);
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("erro", "Falha ao consultar ViaCEP: " + e.getMessage()));
        }
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private String nvl(Object v) {
        return v == null ? "" : v.toString();
    }

    private String formatarCep(String cepLimpo) {
        if (cepLimpo.length() == 8) return cepLimpo.substring(0, 5) + "-" + cepLimpo.substring(5);
        return cepLimpo;
    }

    private String encodeSegmento(String s) {
        return java.net.URLEncoder.encode(s, java.nio.charset.StandardCharsets.UTF_8);
    }
}
