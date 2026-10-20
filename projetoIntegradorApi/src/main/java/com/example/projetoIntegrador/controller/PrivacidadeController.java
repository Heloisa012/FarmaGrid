package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.Login;
import com.example.projetoIntegrador.repository.*;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/privacidade")
public class PrivacidadeController {
    private final LoginRepository logins;
    private final PacienteRepository pacientes;
    private final MedicoRepository medicos;
    private final ReceitaRepository receitas;
    private final ProntuarioRepository prontuarios;
    private final TeleconsultaRepository consultas;
    private final RelatorioRepository relatorios;
    private final SolicitacaoExameRepository exames;
    private final PacienteAlergiaRepository alergias;
    private final DependenteRepository dependentes;
    private final MedicoClinicaRepository clinicas;
    private final DisponibilidadeMedicoRepository disponibilidades;
    private final CupomResgateRepository resgates;

    public PrivacidadeController(LoginRepository logins, PacienteRepository pacientes,
            MedicoRepository medicos, ReceitaRepository receitas, ProntuarioRepository prontuarios,
            TeleconsultaRepository consultas, RelatorioRepository relatorios,
            SolicitacaoExameRepository exames, PacienteAlergiaRepository alergias,
            DependenteRepository dependentes, MedicoClinicaRepository clinicas,
            DisponibilidadeMedicoRepository disponibilidades, CupomResgateRepository resgates) {
        this.logins = logins; this.pacientes = pacientes; this.medicos = medicos;
        this.receitas = receitas; this.prontuarios = prontuarios; this.consultas = consultas;
        this.relatorios = relatorios; this.exames = exames; this.alergias = alergias;
        this.dependentes = dependentes; this.clinicas = clinicas;
        this.disponibilidades = disponibilidades; this.resgates = resgates;
    }

    @GetMapping("/exportar")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> exportar(Authentication auth) {
        // pega a conta pelo token sem aceitar id enviado pelo app
        boolean medico = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_MEDICO"));
        boolean paciente = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PACIENTE"));
        if (!medico && !paciente) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        Login login = logins.findByEmailAndTipo(auth.getName(), medico ? 1 : 3)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        Map<String, Object> dados = new LinkedHashMap<>();
        dados.put("exportadoEm", Instant.now().toString());
        dados.put("conta", Map.of("email", login.getEmail(), "tipo", login.getTipo()));
        if (paciente) {
            Long id = login.getIdPaciente();
            if (id == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            dados.put("perfil", pacientes.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
            dados.put("receitas", receitas.findByIdPacienteOrderByIdDesc(id));
            dados.put("prontuarios", prontuarios.findByIdPacienteOrderByIdDesc(id));
            dados.put("consultas", consultas.findByIdPaciente(id));
            dados.put("relatorios", relatorios.findByIdPaciente(id));
            dados.put("solicitacoesExame", exames.findByIdPacienteOrderByIdDesc(id));
            dados.put("alergias", alergias.findByIdIdPaciente(id));
            dados.put("dependentes", dependentes.findByIdPaciente(id));
            dados.put("cuponsResgatados", resgates.findByIdPaciente(id));
        } else {
            Long id = login.getIdMedico();
            if (id == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            dados.put("perfil", medicos.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
            dados.put("clinica", clinicas.findByIdMedico(id).orElse(null));
            dados.put("disponibilidades", disponibilidades.findByIdMedico(id));
            // nao leva prontuarios dos pacientes na copia pessoal do medico
            dados.put("observacao", "Exportacao dos dados cadastrais e profissionais. Registros clinicos de terceiros nao estao incluidos.");
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(dados);
    }
}
