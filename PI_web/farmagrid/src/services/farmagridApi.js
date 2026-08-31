import { apiFetch } from './api.js';

// ─────────────────────────────────────────────────────────────────────────
// ⚠️ GAP DE PRODUTO: GET /api/produtos e GET/POST /api/vendas agora exigem
// ?idFarmacia= / idFarmacia no corpo (EndpointsEspecificosController /
// FarmagridController). O Paciente não tem nenhum vínculo com uma farmácia
// no schema atual (sem coluna id_farmacia). Por isso a Loja e o checkout
// NÃO chamam a API — ficam com o catálogo mock local até haver uma decisão
// de produto sobre qual farmácia um paciente "compra de".
// ─────────────────────────────────────────────────────────────────────────
export const farmagridApi = {
  teleconsultasPorPaciente: (id) => apiFetch(`/api/teleconsultas/paciente/${id}`),
  criarTeleconsulta: (dados) => apiFetch('/api/teleconsultas', { method: 'POST', body: JSON.stringify(dados) }),
  reagendarTeleconsulta: (id, dados) => apiFetch(`/api/teleconsultas/${id}/reagendar`, { method: 'PATCH', body: JSON.stringify(dados) }),

  receitasPorPaciente: (id) => apiFetch(`/api/receitas/paciente/${id}`),

  solicitacoesExamePorPaciente: (id) => apiFetch(`/api/solicitacoes-exame/paciente/${id}`),

  listarMedicos: () => apiFetch('/api/medicos-disponiveis'),

  farmaciasProximas: (idPaciente) => apiFetch(`/api/pacientes/${idPaciente}/farmacias-proximas`),
};

// Teleconsulta (model real): { id, idMedico, idPaciente, data, horario,
// status, duracao, tipo, nomePaciente, linkSala }. Não tem objetos aninhados
// de médico/paciente — por isso recebe o mapa de médicos (id -> {nome,
// especialidade}) carregado separadamente para juntar os dados na exibição.
export function formatarTeleconsulta(t, medicosPorId = {}) {
  const [ano, mes, dia] = (t.data || '').split('-');
  const dataBr = ano && mes && dia ? `${dia}/${mes}/${ano}` : (t.data || '');
  const hora = t.horario ? String(t.horario).slice(0, 5) : '';
  const medico = medicosPorId[t.idMedico];
  return {
    id: t.id,
    data: `${dataBr}${hora ? ` - ${hora}` : ''}`,
    medico: medico ? `${medico.nome} ${medico.sobrenome || ''}`.trim() : '—',
    especialidade: medico?.especialidade || '—',
    tipo: t.tipo || 'Teleconsulta',
    status: t.status || 'Agendada',
    horario: hora,
    linkSala: t.linkSala || null,
    raw: t,
  };
}

// Receita (model real, bem mais rico agora): { id, idMedico, idPaciente,
// medicamento, dosagem, concentracao, frequencia, duracao, viaAdministracao,
// instrucoes, observacoes, dataPrescricao, status }. Não existe campo de
// validade/expiração — dataPrescricao é a data em que foi PRESCRITA, não até
// quando vale.
export function formatarReceita(r) {
  const dose = [r.dosagem, r.concentracao].filter(Boolean).join(' ');
  return {
    id: r.id,
    nome: r.medicamento || 'Medicamento',
    dose: dose || '—',
    freq: r.frequencia || r.duracao || '—',
    dataPrescricao: r.dataPrescricao || '—',
    status: r.status || 'Ativa',
    raw: r,
  };
}
