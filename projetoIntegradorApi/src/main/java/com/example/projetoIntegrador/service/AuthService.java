package com.example.projetoIntegrador.service;

import com.example.projetoIntegrador.dto.CadastroRequest;
import com.example.projetoIntegrador.model.Funcionario;
import com.example.projetoIntegrador.model.Medico;
import com.example.projetoIntegrador.model.Paciente;
import com.example.projetoIntegrador.model.Usuario;
import com.example.projetoIntegrador.repository.FuncionarioRepository;
import com.example.projetoIntegrador.repository.MedicoRepository;
import com.example.projetoIntegrador.repository.PacienteRepository;
import com.example.projetoIntegrador.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final PacienteRepository pacienteRepo;
    private final MedicoRepository medicoRepo;
    private final FuncionarioRepository funcionarioRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepo,
                       PacienteRepository pacienteRepo,
                       MedicoRepository medicoRepo,
                       FuncionarioRepository funcionarioRepo,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.pacienteRepo = pacienteRepo;
        this.medicoRepo = medicoRepo;
        this.funcionarioRepo = funcionarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Usuario registrarUsuario(CadastroRequest req) {
        if (req.email == null || req.senha == null || req.tipo == null) {
            throw new IllegalArgumentException("email, senha e tipo são obrigatórios.");
        }

        if (usuarioRepo.findByEmail(req.email).isPresent()) {
            throw new DataIntegrityViolationException("Email já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(req.email);
        usuario.setSenhaHash(passwordEncoder.encode(req.senha));
        usuario.setTipo(req.tipo.toUpperCase());

        switch (req.tipo.toUpperCase()) {
            case "PACIENTE" -> {
                if (req.nome == null || req.cpf == null) {
                    throw new IllegalArgumentException("nome e cpf são obrigatórios para PACIENTE.");
                }
                Paciente paciente = new Paciente();
                paciente.setNome(req.nome);
                paciente.setCpf(req.cpf);
                paciente.setTelefone(req.telefone);
                paciente.setEmail(req.email);
                paciente.setSexo(req.sexo != null ? req.sexo : "");
                paciente.setDataNascimento(req.dataNascimento);
                paciente.setRua(req.rua != null ? req.rua : "");
                paciente.setNumCasa(req.numCasa != null ? req.numCasa : 0);
                paciente.setBairro(req.bairro != null ? req.bairro : "");
                usuario.setPaciente(pacienteRepo.save(paciente));
            }
            case "MEDICO" -> {
                if (req.nome == null || req.crm == null) {
                    throw new IllegalArgumentException("nome e crm são obrigatórios para MEDICO.");
                }
                Medico medico = new Medico();
                medico.setNome(req.nome);
                medico.setCrm(req.crm);
                medico.setEspecialidade(req.especialidade != null ? req.especialidade : "Geral");
                medico.setClinica(req.clinica);
                usuario.setMedico(medicoRepo.save(medico));
            }
            case "FUNCIONARIO", "BALCONISTA", "CAIXA", "FARMACEUTICO" -> {
                if (req.cpf == null) {
                    throw new IllegalArgumentException("cpf é obrigatório para FUNCIONARIO.");
                }
                Funcionario func = new Funcionario();
                func.setCpf(req.cpf);
                func.setTurno(req.turno != null ? req.turno : "MANHA");
                usuario.setFuncionario(funcionarioRepo.save(func));
                usuario.setTipo("FUNCIONARIO");
            }
            case "CLIENTE_FARMACIA", "ADMIN" -> {
                // só cria o usuário, sem entidade vinculada
            }
            default -> {
                throw new IllegalArgumentException("Tipo inválido. Use: PACIENTE, MEDICO, FUNCIONARIO, CLIENTE_FARMACIA ou ADMIN");
            }
        }

        try {
            return usuarioRepo.save(usuario);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Dados já existentes ou conflito de entidade.", ex);
        }
    }
}
