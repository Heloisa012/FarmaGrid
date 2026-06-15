import { apiFetch, setToken } from './api.js';

export const TIPO_API_PARA_FRONT = {
  PACIENTE: 'paciente',
  MEDICO: 'profissional',
  FUNCIONARIO: 'farmacia',
  CLIENTE_FARMACIA: 'farmacia',
  ADMIN: 'profissional',
};

export const TIPO_FRONT_PARA_API = {
  paciente: 'PACIENTE',
  profissional: 'MEDICO',
  farmacia: 'FUNCIONARIO',
};

export function mapearTipoFront(tipoApi) {
  return TIPO_API_PARA_FRONT[tipoApi?.toUpperCase()] || 'paciente';
}

export async function login(email, senha) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
  setToken(res.token);
  return res;
}

export async function cadastro(dados) {
  const res = await apiFetch('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
  setToken(res.token);
  return res;
}

export async function obterUsuarioAtual() {
  return apiFetch('/auth/me');
}

export async function atualizarPerfil(dados) {
  return apiFetch('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(dados),
  });
}

export function logout() {
  setToken(null);
}

export function montarCadastro(form, tipoFront) {
  const tipo = TIPO_FRONT_PARA_API[tipoFront] || 'PACIENTE';
  const payload = {
    email: form.email,
    senha: form.senha,
    tipo,
    nome: form.nome || undefined,
    cpf: form.cpf || undefined,
    telefone: form.telefone || undefined,
  };

  if (tipo === 'PACIENTE') {
    payload.sexo = form.sexo || 'M';
    payload.dataNascimento = form.dataNascimento || null;
    payload.rua = form.rua || '';
    payload.numCasa = form.numCasa ? Number(form.numCasa) : 0;
    payload.bairro = form.bairro || '';
  }

  if (tipo === 'MEDICO') {
    payload.crm = form.crm || '00000-SP';
    payload.especialidade = form.especialidade || 'Clínica Geral';
    payload.clinica = form.clinica || 'FarmaGrid';
  }

  if (tipo === 'FUNCIONARIO') {
    payload.cpf = form.cpf || '000.000.000-00';
    payload.turno = 'MANHA';
  }

  return payload;
}
