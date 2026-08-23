package com.example.projetoIntegrador.repository;

import com.example.projetoIntegrador.model.SolicitacaoExame;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitacaoExameRepository extends JpaRepository<SolicitacaoExame, Long> {
    List<SolicitacaoExame> findByIdPacienteOrderByIdDesc(Long idPaciente);
}
