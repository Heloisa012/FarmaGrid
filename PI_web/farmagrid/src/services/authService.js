import { apiFetch, setToken } from './api.js';

// ─────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────
export const TIPO_LOGIN = { paciente: 3, profissional: 1 };

export const PERFIL_API_PARA_FRONT = {
  paciente: 'paciente',
  medico: 'profissional',
  farmacia: 'farmacia',
  balconista: 'farmacia',
  caixa: 'farmacia',
};

export function mapearPerfilFront(perfilApi) {
  return PERFIL_API_PARA_FRONT[perfilApi] || 'paciente';
}

export async function login(email, senha, tipoFront) {
  const tipo = TIPO_LOGIN[tipoFront] ?? TIPO_LOGIN.paciente;
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha, tipo }),
  });
  setToken(res.token);
  return res;
}

// Endpoints públicos de cadastro.
export async function cadastroPaciente(dados) {
  return apiFetch('/auth/cadastro/paciente', { method: 'POST', body: JSON.stringify(dados) });
}

export async function cadastroMedico(dados) {
  return apiFetch('/auth/cadastro/medico', { method: 'POST', body: JSON.stringify(dados) });
}

export async function cadastroFarmacia(dados) {
  const cnpj = String(dados.cnpj || '').replace(/\D/g, '');
  const cadastros = JSON.parse(localStorage.getItem('farmagrid_farmacias_demo') || '[]');

  if (cadastros.some(farmacia => farmacia.cnpj === cnpj)) {
    throw new Error('CNPJ já cadastrado nesta demonstração.');
  }

  const farmacia = {
    id: Date.now(),
    nome: dados.nome,
    cnpj,
    cep: String(dados.cep || '').replace(/\D/g, ''),
    telefone: String(dados.telefone || '').replace(/\D/g, ''),
    idCidade: dados.idCidade,
    fotoPerfil: dados.fotoPerfil || null,
    email: dados.email,
  };

  localStorage.setItem('farmagrid_farmacias_demo', JSON.stringify([...cadastros, farmacia]));
  return farmacia;
}

// GET/PUT /api/pacientes/{id}/config (PerfilController) — substitui o
// inexistente /auth/me. Retorna nome, cpf, idade, endereço completo, plano,
// foto (byte[]) e status de assinatura.
export async function buscarConfigPaciente(idPaciente) {
  return apiFetch(`/api/pacientes/${idPaciente}/config`);
}

export async function atualizarConfigPaciente(idPaciente, payload) {
  return apiFetch(`/api/pacientes/${idPaciente}/config`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// PUT /api/pacientes/{id}/foto — espera { foto: byte[] } (Jackson serializa
// byte[] como string base64 automaticamente), por isso mandamos só a parte
// base64 da data URL (sem o prefixo "data:image/...;base64,").
export async function salvarFotoPaciente(idPaciente, base64SemPrefixo) {
  return apiFetch(`/api/pacientes/${idPaciente}/foto`, {
    method: 'PUT',
    body: JSON.stringify({ foto: base64SemPrefixo }),
  });
}

// PUT /api/logins/{id}/senha — id aqui é o id da linha `login`, não o
// idPaciente. Ainda não há campo de troca de senha na tela de Editar Perfil.
export async function alterarSenha(idLogin, senhaAtual, novaSenha) {
  return apiFetch(`/api/logins/${idLogin}/senha`, {
    method: 'PUT',
    body: JSON.stringify({ senhaAtual, novaSenha }),
  });
}

export function logout() {
  setToken(null);
}

// Monta o payload de CadastroPacienteRequest / CadastroMedicoRequest
// (com os nomes de campo exatos que a API espera).
export function montarCadastro(form, tipoFront) {
  if (tipoFront === 'profissional') {
    return {
      email: form.email,
      senha: form.senha,
      nome: form.nome,
      crm: form.crm || '00000-SP',
      especialidade: form.especialidade || 'Clínica Geral',
      clinica: form.clinica || 'FarmaGrid',
      enderecoClinica: form.enderecoClinica || '',
      telefone: form.telefone || '',
      endereco: form.endereco || '',
      dataNascimento: form.dataNascimento || null,
      rqe: form.rqe || '',
      subespecialidades: form.subespecialidades || '',
      horarioInicio: form.horarioInicio || '08:00',
      horarioTermino: form.horarioTermino || '18:00',
      tempoConsulta: form.tempoConsulta || '30',
      valorConsulta: form.valorConsulta || '0',
      tipoAtendimento: form.tipoAtendimento || 'Presencial',
    };
  }

  // paciente
  return {
    email: form.email,
    senha: form.senha,
    nome: form.nome,
    cpf: form.cpf,
    dataNascimento: form.dataNascimento || null,
    sexo: form.sexo || 'M',
    rua: form.rua || '',
    numCasa: form.numCasa ? Number(form.numCasa) : 0,
    bairro: form.bairro || '',
    cidade: form.cidade || '',
    estado: form.estado || '',
    idCidade: null, // ⚠️ não há seletor de cidade (tabela de cidades) no formulário ainda
    idPlano: null,  // ⚠️ não há seletor de plano de saúde no formulário ainda
    telefone: form.telefone || '',
    cep: form.cep || '',
    tipoSanguineo: form.tipoSanguineo || '',
    contatoEmergenciaNome: form.contatoEmergenciaNome || '',
    contatoEmergenciaTelefone: form.contatoEmergenciaTelefone || '',
  };
}
