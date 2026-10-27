import { apiFetch } from './api.js';

/**
 * Serviço de CEP — faz proxy pelo backend FarmaGrid (GET /api/cep/*),
 * que por sua vez consulta a API pública ViaCEP.
 *
 * Formato de retorno do backend:
 *   { cep, logradouro, bairro, cidade, estado, ibge }
 */

/**
 * Busca endereço por CEP.
 * @param {string} cep  CEP com ou sem máscara (ex.: "13010-101" ou "13010101")
 * @returns {Promise<{cep,logradouro,bairro,cidade,estado,ibge}>}
 */
export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP deve ter 8 dígitos.');
  return apiFetch(`/api/cep/${cepLimpo}`);
}

/**
 * Busca CEPs por logradouro (busca reversa).
 * @param {string} uf      Sigla do estado (ex.: "SP")
 * @param {string} cidade  Nome da cidade (ex.: "Campinas")
 * @param {string} rua     Trecho do logradouro (mín. 3 caracteres)
 * @returns {Promise<Array<{cep,logradouro,bairro,cidade,estado}>>}
 */
export async function buscarCepPorEndereco(uf, cidade, rua) {
  const params = new URLSearchParams({ uf, cidade, rua });
  return apiFetch(`/api/cep/busca?${params}`);
}
