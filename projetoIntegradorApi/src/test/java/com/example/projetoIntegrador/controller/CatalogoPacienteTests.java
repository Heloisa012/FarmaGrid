package com.example.projetoIntegrador.controller;

import com.example.projetoIntegrador.model.Produto;
import com.example.projetoIntegrador.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CatalogoPacienteTests {
    @Test
    void catalogoReuneFarmaciasESomenteProdutosComEstoque() {
        var repo = mock(ProdutoRepository.class);
        var controller = new EndpointsEspecificosController();
        ReflectionTestUtils.setField(controller, "produtoRepo", repo);
        var a = produto(1L, 5);
        var b = produto(2L, 3);
        when(repo.findAllByOrderByNomeAsc()).thenReturn(
            List.of(a, b, produto(1L, 0), produto(2L, null), produto(2L, -1)));
        assertEquals(List.of(a, b), controller.listarProdutosDisponiveis());
        verify(repo, never()).findAllByIdFarmaciaOrderByNomeAsc(any());
    }

    private Produto produto(Long farmacia, Integer quantidade) {
        var produto = new Produto();
        produto.setIdFarmacia(farmacia);
        produto.setQuantidade(quantidade);
        return produto;
    }
}
