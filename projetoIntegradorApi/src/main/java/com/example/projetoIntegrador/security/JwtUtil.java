package com.example.projetoIntegrador.security;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET = "farmagrid-chave-secreta-super-longa-2024!!abc123";
    private static final long EXPIRACAO_MS = 1000L * 60 * 60 * 8; // 8 horas

    // ── Gera o token ──────────────────────────────────────────────────────────
    public String gerarToken(String email, String tipo) {
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");

        long agora = System.currentTimeMillis() / 1000;
        long exp   = agora + (EXPIRACAO_MS / 1000);
        String payloadJson = "{\"sub\":\"" + email + "\",\"tipo\":\"" + tipo + "\",\"iat\":" + agora + ",\"exp\":" + exp + "}";
        String payload = base64Url(payloadJson);

        String assinatura = assinar(header + "." + payload);
        return header + "." + payload + "." + assinatura;
    }

    // ── Valida o token ────────────────────────────────────────────────────────
    public boolean tokenValido(String token) {
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) return false;

            // Verifica assinatura
            String assinaturaEsperada = assinar(partes[0] + "." + partes[1]);
            if (!assinaturaEsperada.equals(partes[2])) return false;

            // Verifica expiração
            Map<String, String> claims = extrairClaims(token);
            long exp = Long.parseLong(claims.get("exp"));
            return System.currentTimeMillis() / 1000 < exp;

        } catch (Exception e) {
            return false;
        }
    }

    // ── Extrai o email (subject) ──────────────────────────────────────────────
    public String extrairEmail(String token) {
        return extrairClaims(token).get("sub");
    }

    // ── Extrai o tipo (PACIENTE, CLIENTE_FARMACIA, etc) ───────────────────────
    public String extrairTipo(String token) {
        return extrairClaims(token).get("tipo");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private Map<String, String> extrairClaims(String token) {
        String[] partes  = token.split("\\.");
        String payload   = new String(Base64.getUrlDecoder().decode(partes[1]), StandardCharsets.UTF_8);
        Map<String, String> map = new HashMap<>();
        payload = payload.replaceAll("[{}\"]", "");
        for (String entry : payload.split(",")) {
            String[] kv = entry.split(":", 2);
            if (kv.length == 2) map.put(kv[0].trim(), kv[1].trim());
        }
        return map;
    }

    private String base64Url(String text) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(text.getBytes(StandardCharsets.UTF_8));
    }

    private String assinar(String dados) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(dados.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao assinar token", e);
        }
    }
}