package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.*;
import com.example.projetoIntegrador.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PrivacidadeControllerTests {
    final LoginRepository logins = mock(LoginRepository.class);
    final PacienteRepository pacientes = mock(PacienteRepository.class);
    final MedicoRepository medicos = mock(MedicoRepository.class);
    final ReceitaRepository receitas = mock(ReceitaRepository.class);
    final ProntuarioRepository prontuarios = mock(ProntuarioRepository.class);
    final PrivacidadeController controller = new PrivacidadeController(logins, pacientes, medicos,
            receitas, prontuarios, mock(TeleconsultaRepository.class), mock(RelatorioRepository.class),
            mock(SolicitacaoExameRepository.class), mock(PacienteAlergiaRepository.class),
            mock(DependenteRepository.class), mock(MedicoClinicaRepository.class),
            mock(DisponibilidadeMedicoRepository.class), mock(CupomResgateRepository.class));

    @Test
    void exportaSomentePacienteDoToken() {
        Login login = new Login(); login.setIdPaciente(12L);
        login.setEmail("p@teste.com"); login.setTipo(3);
        when(logins.findByEmailAndTipo("p@teste.com", 3)).thenReturn(Optional.of(login));
        when(pacientes.findById(12L)).thenReturn(Optional.of(new Paciente()));
        var auth = UsernamePasswordAuthenticationToken.authenticated("p@teste.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_PACIENTE")));
        var resposta = controller.exportar(auth);
        assertTrue(resposta.getHeaders().getCacheControl().contains("no-store"));
        verify(pacientes).findById(12L);
        verify(receitas).findByIdPacienteOrderByIdDesc(12L);
        verifyNoInteractions(medicos);
    }

    @Test
    void medicoNaoExportaProntuariosDeTerceiros() {
        Login login = new Login(); login.setIdMedico(7L);
        login.setEmail("m@teste.com"); login.setTipo(1);
        when(logins.findByEmailAndTipo("m@teste.com", 1)).thenReturn(Optional.of(login));
        when(medicos.findById(7L)).thenReturn(Optional.of(new Medico()));
        var auth = UsernamePasswordAuthenticationToken.authenticated("m@teste.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_MEDICO")));
        assertFalse(controller.exportar(auth).getBody().containsKey("prontuarios"));
        verifyNoInteractions(prontuarios, receitas, pacientes);
    }

    @Test
    void rejeitaPerfilSemPermissao() {
        var auth = UsernamePasswordAuthenticationToken.authenticated("f@teste.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_FARMACIA")));
        assertThrows(ResponseStatusException.class, () -> controller.exportar(auth));
        verifyNoInteractions(logins, pacientes, medicos);
    }

    @Test
    void respostasNaoExibemSenhasOuTokenDePagamento() throws Exception {
        var mapper = new ObjectMapper();
        Login login = new Login(); login.setSenha("segredo");
        Medico medico = new Medico(); medico.setSenha("segredo");
        Cartao cartao = new Cartao(); cartao.setTokenPagamento("segredo");
        assertFalse(mapper.writeValueAsString(login).contains("segredo"));
        assertFalse(mapper.writeValueAsString(medico).contains("segredo"));
        assertFalse(mapper.writeValueAsString(cartao).contains("segredo"));
    }
}
