package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.dto.LoginRequest;
import com.example.projetoIntegrador.dto.LoginResponse;
import com.example.projetoIntegrador.dto.CadastroMedicoRequest;
import com.example.projetoIntegrador.dto.CadastroPacienteRequest;
import com.example.projetoIntegrador.model.Login;
import com.example.projetoIntegrador.model.Medico;
import com.example.projetoIntegrador.model.MedicoClinica;
import com.example.projetoIntegrador.model.Paciente;
import com.example.projetoIntegrador.repository.MedicoClinicaRepository;
import com.example.projetoIntegrador.repository.MedicoRepository;
import com.example.projetoIntegrador.repository.PacienteRepository;
import com.example.projetoIntegrador.repository.LoginRepository;
import com.example.projetoIntegrador.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private LoginRepository loginRepo;
    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private MedicoRepository medicoRepo;
    @Autowired private MedicoClinicaRepository medicoClinicaRepo;
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

        if (login == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos.");
        }

        boolean senhaValida = passwordEncoder.matches(req.senha, login.getSenha());
        boolean senhaLegada = !senhaValida && req.senha.equals(login.getSenha());

        if (!senhaValida && !senhaLegada) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos.");
        }

        if (senhaLegada) {
            login.setSenha(passwordEncoder.encode(req.senha));
            loginRepo.save(login);
        }

        String perfil;
        if (login.getTipo() != null && login.getTipo() == 1) {
            perfil = "medico";
        } else if (login.getIdPaciente() != null) {
            perfil = "paciente";
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

    @PostMapping("/cadastro/paciente")
    @Transactional
    public ResponseEntity<?> cadastrarPaciente(@RequestBody CadastroPacienteRequest req) {
        if (loginRepo.findByEmailAndTipo(req.email, 3).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        }

        Paciente paciente = new Paciente();
        paciente.setNome(req.nome);
        paciente.setDataNascimento(req.dataNascimento);
        paciente.setSexo(req.sexo);
        paciente.setRua(req.rua);
        paciente.setNumCasa(req.numCasa);
        paciente.setBairro(req.bairro);
        paciente.setIdCidade(req.idCidade);
        paciente.setIdPlano(req.idPlano);
        paciente.setTelefone(req.telefone);
        paciente.setCep(req.cep);
        paciente.setTipoSanguineo(req.tipoSanguineo);
        paciente.setContatoEmergenciaNome(req.contatoEmergenciaNome);
        paciente.setContatoEmergenciaTelefone(req.contatoEmergenciaTelefone);
        Paciente salvo = pacienteRepo.save(paciente);

        Login login = new Login();
        login.setEmail(req.email);
        login.setSenha(passwordEncoder.encode(req.senha));
        login.setTipo(3);
        login.setIdPaciente(salvo.getId());
        loginRepo.save(login);

        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping("/cadastro/medico")
    @Transactional
    public ResponseEntity<?> cadastrarMedico(@RequestBody CadastroMedicoRequest req) {
        if (loginRepo.findByEmailAndTipo(req.email, 1).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        }

        Medico medico = new Medico();
        medico.setNome(req.nome);
        medico.setCrm(req.crm);
        medico.setEspecialidade(req.especialidade);
        medico.setEmail(req.email);
        medico.setSenha(passwordEncoder.encode(req.senha));
        medico.setTelefone(req.telefone);
        medico.setEndereco(req.endereco);
        medico.setDataNascimento(parseDate(req.dataNascimento));
        medico.setRqe(req.rqe);
        medico.setSubespecialidades(req.subespecialidades);
        medico.setHorarioInicio(parseTime(req.horarioInicio));
        medico.setHorarioTermino(parseTime(req.horarioTermino));
        medico.setTipoAtendimento(req.tipoAtendimento);
        Medico salvo = medicoRepo.save(medico);

        MedicoClinica medicoClinica = new MedicoClinica();
        medicoClinica.setIdMedico(salvo.getId());
        medicoClinica.setNomeClinica(req.clinica);
        medicoClinica.setEnderecoClinica(req.enderecoClinica);
        medicoClinica.setTempoConsulta(req.tempoConsulta);
        medicoClinica.setValorConsulta(parseDecimal(req.valorConsulta));
        medicoClinicaRepo.save(medicoClinica);

        Login login = new Login();
        login.setEmail(req.email);
        login.setSenha(passwordEncoder.encode(req.senha));
        login.setTipo(1);
        login.setIdMedico(salvo.getId());
        loginRepo.save(login);

        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    private LocalDate parseDate(String value) {
        return value == null || value.isBlank() ? null : LocalDate.parse(value);
    }

    private LocalTime parseTime(String value) {
        return value == null || value.isBlank() ? null : LocalTime.parse(value);
    }

    private BigDecimal parseDecimal(String value) {
        return value == null || value.isBlank() ? null : new BigDecimal(value);
    }
}
