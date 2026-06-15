class Paciente {
  String nome;
  String dataNascimento;
  String sexo;
  String rua;
  String numero;
  String cidade;
  String planoSaude;
  String senha;

 String get getNome => this.nome;

 set setNome(String nome) => this.nome = nome;

  get getDataNascimento => this.dataNascimento;

 set setDataNascimento( dataNascimento) => this.dataNascimento = dataNascimento;

  get getSexo => this.sexo;

 set setSexo( sexo) => this.sexo = sexo;

  get getRua => this.rua;

 set setRua( rua) => this.rua = rua;

  get getNumero => this.numero;

 set setNumero( numero) => this.numero = numero;

  get getCidade => this.cidade;

 set setCidade( cidade) => this.cidade = cidade;

  get getPlanoSaude => this.planoSaude;

 set setPlanoSaude( planoSaude) => this.planoSaude = planoSaude;

  get getSenha => this.senha;

 set setSenha( senha) => this.senha = senha;
 
  Paciente(this.nome, this.dataNascimento, this.sexo, this.rua, 
           this.numero, this.cidade, this.planoSaude, this.senha);
}