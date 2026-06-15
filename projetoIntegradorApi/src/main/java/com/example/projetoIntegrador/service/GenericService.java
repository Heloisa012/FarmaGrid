package com.example.projetoIntegrador.service;

import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GenericService {

    @Transactional(readOnly = true)
    public <T> List<T> listar(JpaRepository<T, Long> repository) {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public <T> T buscar(JpaRepository<T, Long> repository, Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
    }

    @Transactional
    public <T> T salvar(JpaRepository<T, Long> repository, T entity) {
        return repository.save(entity);
    }

    @Transactional
    public <T> T atualizar(JpaRepository<T, Long> repository, Long id, T entity) {
        T existente = buscar(repository, id);
        BeanUtils.copyProperties(entity, existente, "id");
        return repository.save(existente);
    }

    @Transactional
    public <T> void deletar(JpaRepository<T, Long> repository, Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Registro não encontrado");
        }
        repository.deleteById(id);
    }
}
