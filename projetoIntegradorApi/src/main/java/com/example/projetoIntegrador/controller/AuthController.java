package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.dto.CadastroRequest;
import com.example.projetoIntegrador.dto.LoginRequest;
import com.example.projetoIntegrador.dto.LoginResponse;
import com.example.projetoIntegrador.dto.UsuarioMeResponse;
import com.example.projetoIntegrador.model.Funcionario;
import com.example.projetoIntegrador.model.Medico;
import com.example.projetoIntegrador.model.Paciente;
import com.example.projetoIntegrador.model.Usuario;
import com.example.projetoIntegrador.repository.FuncionarioRepository;
import com.example.projetoIntegrador.repository.MedicoRepository;
import com.example.projetoIntegrador.repository.PacienteRepository;
import com.example.projetoIntegrador.repository.UsuarioRepository;
import com.example.projetoIntegrador.security.JwtUtil;
import com.example.projetoIntegrador.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private MedicoRepository medicoRepo;
    @Autowired private FuncionarioRepository funcionarioRepo;
    @Autowired private AuthService authService;
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
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Usuario usuario = usuarioRepo.findByEmail(req.email).orElse(null);

        if (usuario == null || !passwordEncoder.matches(req.senha, usuario.getSenhaHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos.");
        }

        String nome  = resolverNome(usuario);
        String token = jwtUtil.gerarToken(usuario.getEmail(), usuario.getTipo());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getTipo(), nome));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /auth/cadastro
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody CadastroRequest req) {
        if (req.email == null || req.senha == null || req.tipo == null) {
            return ResponseEntity.badRequest().body("email, senha e tipo são obrigatórios.");
        }

        final int maxAttempts = 3;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                Usuario usuario = authService.registrarUsuario(req);
                String token = jwtUtil.gerarToken(usuario.getEmail(), usuario.getTipo());
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(new LoginResponse(token, usuario.getTipo(), req.nome != null ? req.nome : req.email));
            } catch (CannotAcquireLockException ex) {
                if (attempt == maxAttempts) {
                    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                            .body("Erro temporário no banco de dados. Tente novamente em alguns segundos.");
                }
            } catch (DataIntegrityViolationException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Dados já existentes ou conflito de entidade.");
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(ex.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Erro temporário no banco de dados. Tente novamente em alguns segundos.");
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /auth/me
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Não autenticado.");
        }

        String email = auth.getPrincipal().toString();
        Usuario usuario = usuarioRepo.findByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        return ResponseEntity.ok(buildMeResponse(usuario));
    }

    private UsuarioMeResponse buildMeResponse(Usuario usuario) {
        Long idPaciente = usuario.getPaciente() != null ? usuario.getPaciente().getId() : null;
        Long idMedico = usuario.getMedico() != null ? usuario.getMedico().getId() : null;
        Long idFuncionario = usuario.getFuncionario() != null ? usuario.getFuncionario().getId() : null;

        return new UsuarioMeResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getTipo(),
                resolverNome(usuario),
                idPaciente,
                idMedico,
                idFuncionario
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Resolve o nome do usuário conforme o tipo
    // ──────────────────────────────────────────────────────────────────────────
    private String resolverNome(Usuario usuario) {
        if (usuario.getPaciente()    != null) return usuario.getPaciente().getNome();
        if (usuario.getMedico()      != null) return usuario.getMedico().getNome();
        if (usuario.getFuncionario() != null) return "Funcionário #" + usuario.getFuncionario().getId();
        return usuario.getEmail();
    }
}
