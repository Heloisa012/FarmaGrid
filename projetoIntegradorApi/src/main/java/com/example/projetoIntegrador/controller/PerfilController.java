package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.dto.AlterarSenhaRequest;
import com.example.projetoIntegrador.dto.FotoPerfilRequest;
import com.example.projetoIntegrador.dto.PacienteConfigResponse;
import com.example.projetoIntegrador.dto.PacienteDadosRequest;
import com.example.projetoIntegrador.model.Login;
import com.example.projetoIntegrador.model.Paciente;
import com.example.projetoIntegrador.repository.LoginRepository;
import com.example.projetoIntegrador.repository.PacienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api")
public class PerfilController {
    private final PacienteRepository pacienteRepo;
    private final LoginRepository loginRepo;
    private final PasswordEncoder passwordEncoder;

    public PerfilController(PacienteRepository pacienteRepo, LoginRepository loginRepo,
                            PasswordEncoder passwordEncoder) {
        this.pacienteRepo = pacienteRepo;
        this.loginRepo = loginRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/pacientes/{id}/config")
    public ResponseEntity<PacienteConfigResponse> buscarPaciente(@PathVariable Long id) {
        Paciente p = pacienteRepo.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        completarCidadePeloCep(p);
        PacienteConfigResponse r = new PacienteConfigResponse();
        r.id = p.getId(); r.nome = p.getNome(); r.cpf = p.getCpf(); r.idade = p.getIdade();
        r.dataNascimento = p.getDataNascimento(); r.sexo = p.getSexo(); r.telefone = p.getTelefone();
        r.rua = p.getRua(); r.numCasa = p.getNumCasa(); r.bairro = p.getBairro(); r.cidade = p.getCidade(); r.estado = p.getEstado();
        r.cep = p.getCep(); r.tipoSanguineo = p.getTipoSanguineo(); r.planoSaude = p.getPlanoSaude();
        r.contatoEmergenciaNome = p.getContatoEmergenciaNome();
        r.contatoEmergenciaTelefone = p.getContatoEmergenciaTelefone(); r.fotoPerfil = p.getFotoPerfil();
        r.planoPremium = p.getPlanoPremium(); r.assinaturaStatus = p.getAssinaturaStatus();
        r.assinaturaValidade = p.getAssinaturaValidade();
        loginRepo.findByIdPaciente(id).ifPresent(login -> r.email = login.getEmail());
        return ResponseEntity.ok(r);
    }

    private void completarCidadePeloCep(Paciente p) {
        if (p.getCidade() != null && !p.getCidade().isBlank() || p.getCep() == null) return;
        String cep = p.getCep().replaceAll("[^0-9]", "");
        if (cep.length() != 8) return;
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://viacep.com.br/ws/" + cep + "/json/")).GET().build();
            String body = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString()).body();
            var json = new ObjectMapper().readTree(body);
            if (!json.path("erro").asBoolean(false)) {
                p.setCidade(json.path("localidade").asText()); p.setEstado(json.path("uf").asText());
                pacienteRepo.save(p);
            }
        } catch (Exception ignored) { }
    }

    @PutMapping("/pacientes/{id}/config")
    @Transactional
    public ResponseEntity<?> atualizarPaciente(@PathVariable Long id, @RequestBody PacienteDadosRequest req) {
        Paciente p = pacienteRepo.findById(id).orElse(null);
        Login login = loginRepo.findByIdPaciente(id).orElse(null);
        if (p == null || login == null) return ResponseEntity.notFound().build();
        if (req.email != null && !req.email.equalsIgnoreCase(login.getEmail())
                && loginRepo.existsByEmailAndIdNot(req.email, login.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Este e-mail já está em uso.");
        }
        p.setNome(req.nome); p.setCpf(req.cpf); p.setDataNascimento(req.dataNascimento); p.setSexo(req.sexo);
        p.setTelefone(req.telefone); p.setRua(req.rua); p.setNumCasa(req.numCasa); p.setBairro(req.bairro);
        p.setCidade(req.cidade); p.setEstado(req.estado); p.setCep(req.cep); p.setTipoSanguineo(req.tipoSanguineo);
        p.setPlanoSaude(req.planoSaude); p.setContatoEmergenciaNome(req.contatoEmergenciaNome);
        p.setContatoEmergenciaTelefone(req.contatoEmergenciaTelefone);
        login.setEmail(req.email);
        pacienteRepo.save(p); loginRepo.save(login);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/pacientes/{id}/foto")
    public ResponseEntity<?> fotoPaciente(@PathVariable Long id, @RequestBody FotoPerfilRequest req) {
        Paciente p = pacienteRepo.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        p.setFotoPerfil(req.foto); pacienteRepo.save(p);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/logins/{id}/senha")
    public ResponseEntity<?> alterarSenha(@PathVariable Long id, @RequestBody AlterarSenhaRequest req) {
        Login login = loginRepo.findById(id).orElse(null);
        if (login == null) return ResponseEntity.notFound().build();
        boolean atualValida = passwordEncoder.matches(req.senhaAtual, login.getSenha())
                || req.senhaAtual.equals(login.getSenha());
        if (!atualValida) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha atual incorreta.");
        if (req.novaSenha == null || req.novaSenha.length() < 6)
            return ResponseEntity.badRequest().body("A nova senha deve ter pelo menos 6 caracteres.");
        login.setSenha(passwordEncoder.encode(req.novaSenha)); loginRepo.save(login);
        return ResponseEntity.ok().build();
    }
}
