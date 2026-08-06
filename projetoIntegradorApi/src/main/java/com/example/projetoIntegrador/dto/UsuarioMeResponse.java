package com.example.projetoIntegrador.dto;

public class UsuarioMeResponse {
    public Long id;
    public String email;
    public String tipo;
    public String nome;
    public Long idPaciente;
    public Long idMedico;
    public Long idFuncionario;

    public UsuarioMeResponse(Long id, String email, String tipo, String nome,
                             Long idPaciente, Long idMedico, Long idFuncionario) {
        this.id = id;
        this.email = email;
        this.tipo = tipo;
        this.nome = nome;
        this.idPaciente = idPaciente;
        this.idMedico = idMedico;
        this.idFuncionario = idFuncionario;
    }
}
