package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.dto.LoginRequest;
import com.example.projetoIntegrador.dto.LoginResponse;
import com.example.projetoIntegrador.model.Login;
import com.example.projetoIntegrador.repository.LoginRepository;
import com.example.projetoIntegrador.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private LoginRepository loginRepo;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private jakarta.persistence.EntityManager entityManager;

    @GetMapping("/db-status")
    public ResponseEntity<?> dbStatus() {
        try {
            var result = entityManager.createNativeQuery(
                "SELECT trx_id, trx_state, trx_started, trx_query, trx_mysql_thread_id FROM information_schema.innodb_trx"
            ).getResultList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar status: " + e.getMessage());
        }
    }

    @GetMapping("/db-processlist")
    public ResponseEntity<?> dbProcesslist() {
        try {
            var result = entityManager.createNativeQuery("SHOW PROCESSLIST").getResultList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar processlist: " + e.getMessage());
        }
    }

    @PostMapping("/db-kill/{id}")
    public ResponseEntity<?> dbKill(@PathVariable Long id) {
        try {
            entityManager.createNativeQuery("KILL " + id).executeUpdate();
            return ResponseEntity.ok("Processo " + id + " finalizado.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao finalizar processo: " + e.getMessage());
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /auth/login
    // Equivalente ao antigo handler ipcMain 'login' do Electron: busca por
    // email + tipo na tabela `login`, compara a senha com bcrypt e resolve o
    // perfil (medico / farmacia / balconista / caixa).
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Login login = loginRepo.findByEmailAndTipo(req.email, req.tipo).orElse(null);

        if (login == null || !passwordEncoder.matches(req.senha, login.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos.");
        }

        String perfil;
        if (login.getTipo() != null && login.getTipo() == 1) {
            perfil = "medico";
        } else if (login.getIdFarmacia() != null) {
            perfil = "farmacia";
        } else if (login.getIdBalconista() != null) {
            perfil = "balconista";
        } else if (login.getIdCaixa() != null) {
            perfil = "caixa";
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário sem perfil associado.");
        }

        String token = jwtUtil.gerarToken(login.getEmail(), perfil);
        return ResponseEntity.ok(new LoginResponse(token, login, perfil));
    }
}
