package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.service.RecuperacaoSenhaService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth/recuperacao")
public class RecuperacaoSenhaController {
    private final RecuperacaoSenhaService service;
    public RecuperacaoSenhaController(RecuperacaoSenhaService service) { this.service = service; }
    public record Solicitar(String email) {}
    public record Redefinir(String email, String codigo, String novaSenha) {}

    @PostMapping("/solicitar")
    public Map<String, Object> solicitar(@RequestBody Solicitar req) {
        service.solicitar(req.email());
        return Map.of("sucesso", true, "mensagem", "Se o e-mail estiver cadastrado, você receberá um código.");
    }

    @PostMapping("/redefinir")
    public Map<String, Object> redefinir(@RequestBody Redefinir req) {
        service.redefinir(req.email(), req.codigo(), req.novaSenha());
        return Map.of("sucesso", true);
    }
}