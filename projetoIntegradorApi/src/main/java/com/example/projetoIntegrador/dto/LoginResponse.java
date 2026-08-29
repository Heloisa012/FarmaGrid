package com.example.projetoIntegrador.dto;

public class LoginResponse {
    public String token;
    public Long id;
    public String email;
    public Integer tipo;
    public Long idMedico;
    public Long idPaciente;
    public Long idFarmacia;
    public String idBalconista;
    public String idCaixa;
    public String perfil;

    public LoginResponse(String token, com.example.projetoIntegrador.model.Login login, String perfil) {
        this.token = token;
        this.id = login.getId();
        this.email = login.getEmail();
        this.tipo = login.getTipo();
        this.idMedico = login.getIdMedico();
        this.idPaciente = login.getIdPaciente();
        this.idFarmacia = login.getIdFarmacia();
        this.idBalconista = login.getIdBalconista();
        this.idCaixa = login.getIdCaixa();
        this.perfil = perfil;
    }
}
