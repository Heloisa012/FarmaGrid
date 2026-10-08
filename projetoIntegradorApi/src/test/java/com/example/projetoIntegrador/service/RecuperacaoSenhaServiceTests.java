package com.example.projetoIntegrador.service;

import com.example.projetoIntegrador.repository.LoginRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RecuperacaoSenhaServiceTests {
    private final LoginRepository repo = mock(LoginRepository.class);
    private final PasswordEncoder encoder = mock(PasswordEncoder.class);

    @Test void exigeConfiguracaoSemConsultarContas() {
        var service = new RecuperacaoSenhaService(repo, encoder, "", "");
        var error = assertThrows(ResponseStatusException.class, () -> service.solicitar("pessoa@example.com"));
        assertEquals(503, error.getStatusCode().value());
        verifyNoInteractions(repo);
    }

    @Test void rejeitaEmailInvalido() {
        var service = new RecuperacaoSenhaService(repo, encoder, "teste", "remetente@example.com");
        var error = assertThrows(ResponseStatusException.class, () -> service.solicitar("email invalido"));
        assertEquals(400, error.getStatusCode().value());
        verifyNoInteractions(repo);
    }

    @Test void naoRedefineSemDesafioMesmoComIdOuCodigoInventado() {
        var service = new RecuperacaoSenhaService(repo, encoder, "teste", "remetente@example.com");
        assertThrows(ResponseStatusException.class, () -> service.redefinir("pessoa@example.com", "123456", "novaSenha123"));
        verifyNoInteractions(repo, encoder);
    }

    @Test void limitaReenvioMesmoParaContaInexistente() {
        var service = new RecuperacaoSenhaService(repo, encoder, "teste", "remetente@example.com");
        service.solicitar("pessoa@example.com");
        var error = assertThrows(ResponseStatusException.class, () -> service.solicitar("PESSOA@example.com"));
        assertEquals(429, error.getStatusCode().value());
        verify(repo, never()).saveAllAndFlush(any());
    }

    @Test void rejeitaSenhaAcimaDoLimiteDoBcrypt() {
        var service = new RecuperacaoSenhaService(repo, encoder, "teste", "remetente@example.com");
        assertThrows(ResponseStatusException.class, () -> service.redefinir("pessoa@example.com", "123456", "á".repeat(37)));
        verifyNoInteractions(repo, encoder);
    }
}