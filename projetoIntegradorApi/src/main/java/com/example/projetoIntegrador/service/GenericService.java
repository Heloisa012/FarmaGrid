package com.example.projetoIntegrador.service;

import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GenericService {

    @Transactional(readOnly = true)
    public <T, ID> List<T> listar(JpaRepository<T, ID> repository) {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public <T, ID> T buscar(JpaRepository<T, ID> repository, ID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
    }

    @Transactional
    public <T, ID> T salvar(JpaRepository<T, ID> repository, T entity) {
        return repository.save(entity);
    }

    @Transactional
    public <T, ID> T atualizar(JpaRepository<T, ID> repository, ID id, T entity) {
        T existente = buscar(repository, id);
        BeanUtils.copyProperties(entity, existente, "id");
        return repository.save(existente);
    }

    @Transactional
    public <T, ID> void deletar(JpaRepository<T, ID> repository, ID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Registro não encontrado");
        }
        repository.deleteById(id);
    }
}
