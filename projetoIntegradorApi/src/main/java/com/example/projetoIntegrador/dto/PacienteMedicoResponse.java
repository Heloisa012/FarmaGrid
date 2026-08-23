package com.example.projetoIntegrador.dto;

import java.util.ArrayList;
import java.util.List;

public class PacienteMedicoResponse {
    public Long id;
    public String nome;
    public String cpf;
    public Integer idade;
    public String condicao;
    public String ultimaVisita;
    public String status;
    public long totalConsultas;
    public long totalReceitas;
    public List<String> condicoes = new ArrayList<>();
}
