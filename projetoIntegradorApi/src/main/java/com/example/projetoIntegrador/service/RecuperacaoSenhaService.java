package com.example.projetoIntegrador.service;

import com.example.projetoIntegrador.repository.LoginRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.Duration;
import java.util.*;

@Service
public class RecuperacaoSenhaService {
    private final LoginRepository logins;
    private final PasswordEncoder encoder;
    private final String apiKey;
    private final String remetente;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Desafio> desafios = new HashMap<>();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    private static class Desafio {
        byte[] hash;
        long criado;
        int tentativas;
        Desafio(byte[] hash, long criado) { this.hash = hash; this.criado = criado; }
    }

    public RecuperacaoSenhaService(LoginRepository logins, PasswordEncoder encoder,
            @Value("${BREVO_API_KEY:}") String apiKey,
            @Value("${BREVO_SENDER_EMAIL:}") String remetente) {
        this.logins = logins;
        this.encoder = encoder;
        this.apiKey = apiKey;
        this.remetente = remetente;
    }

    private String email(String valor) {
        if (valor == null || valor.length() > 100 || !valor.trim().matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um e-mail válido.");
        return valor.trim().toLowerCase(Locale.ROOT);
    }

    private byte[] hash(String codigo) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(codigo.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) { throw new IllegalStateException(e); }
    }

    public synchronized void solicitar(String valor) {
        String email = email(valor);
        long agora = System.currentTimeMillis();
        desafios.entrySet().removeIf(e -> agora - e.getValue().criado >= 600_000);
        Desafio anterior = desafios.get(email);
        if (anterior != null && agora - anterior.criado < 60_000)
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Aguarde um minuto para solicitar outro código.");
        if (apiKey.isBlank() || remetente.isBlank())
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Envio de e-mail ainda não configurado.");
        if (desafios.size() >= 10000)
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Tente novamente mais tarde.");
        String codigo = String.format(Locale.ROOT, "%06d", random.nextInt(1000000));
        Desafio desafio = new Desafio(hash(codigo), agora);
        desafios.put(email, desafio);
        if (logins.findAllByEmailIgnoreCase(email).isEmpty()) return;
        try {
            String body = new ObjectMapper().writeValueAsString(Map.of(
                "sender", Map.of("name", "FarmaGrid", "email", remetente),
                "to", List.of(Map.of("email", email)),
                "subject", "Código de recuperação de senha - FarmaGrid",
                "textContent", "Seu código de recuperação é: " + codigo +
                    ". Ele expira em 10 minutos. Se você não solicitou, ignore este e-mail."));
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.brevo.com/v3/smtp/email"))
                .timeout(Duration.ofSeconds(20))
                .header("api-key", apiKey).header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body)).build();
            HttpResponse<Void> response = http.send(request, HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() < 200 || response.statusCode() >= 300)
                throw new IllegalStateException("Brevo HTTP " + response.statusCode());
        } catch (Exception e) {
            desafios.remove(email);
            if (e instanceof InterruptedException) Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível enviar o código. Tente novamente.");
        }
    }

    public synchronized void redefinir(String valor, String codigo, String novaSenha) {
        String email = email(valor);
        if (novaSenha == null || novaSenha.length() < 6 || novaSenha.getBytes(StandardCharsets.UTF_8).length > 72)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use uma senha de pelo menos 6 caracteres e até 72 bytes.");
        Desafio desafio = desafios.get(email);
        if (desafio == null || System.currentTimeMillis() - desafio.criado >= 600_000 || desafio.tentativas >= 5) {
            desafios.remove(email);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código inválido ou expirado. Solicite outro.");
        }
        desafio.tentativas++;
        if (codigo == null || !codigo.matches("[0-9]{6}") || !MessageDigest.isEqual(desafio.hash, hash(codigo)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código inválido ou expirado.");
        var contas = logins.findAllByEmailIgnoreCase(email);
        if (contas.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código inválido ou expirado.");
        String senhaHash = encoder.encode(novaSenha);
        contas.forEach(login -> login.setSenha(senhaHash));
        logins.saveAllAndFlush(contas);
        desafios.remove(email);
    }
}