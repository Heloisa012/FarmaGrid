import { apiFetch } from './api.js';

export const farmagridApi = {
  teleconsultasPorPaciente: (id) => apiFetch(`/api/teleconsultas/paciente/${id}`),
  teleconsultasPorMedico: (id) => apiFetch(`/api/teleconsultas/medico/${id}`),
  criarTeleconsulta: (dados) => apiFetch('/api/teleconsultas', { method: 'POST', body: JSON.stringify(dados) }),

  receitasPorPaciente: (id) => apiFetch(`/api/receitas/paciente/${id}`),
  criarReceita: (dados) => apiFetch('/api/receitas', { method: 'POST', body: JSON.stringify(dados) }),

  listarMedicamentos: () => apiFetch('/api/medicamentos'),
  listarMedicos: () => apiFetch('/api/medicos'),
  listarPacientes: () => apiFetch('/api/pacientes'),
  listarProntuarios: () => apiFetch('/api/prontuarios'),
  listarParcerias: () => apiFetch('/api/parcerias'),
  criarParceria: (dados) => apiFetch('/api/parcerias', { method: 'POST', body: JSON.stringify(dados) }),

  listarEstoques: () => apiFetch('/api/estoques'),
  criarEstoque: (dados) => apiFetch('/api/estoques', { method: 'POST', body: JSON.stringify(dados) }),

  vendasHoje: () => apiFetch('/api/vendas/hoje'),
  criarVenda: (dados) => apiFetch('/api/vendas', { method: 'POST', body: JSON.stringify(dados) }),

  validarCupom: (cupom) => apiFetch(`/api/descontos/validar/${encodeURIComponent(cupom)}`),
  usarCupom: (cupom) => apiFetch(`/api/descontos/usar/${encodeURIComponent(cupom)}`, { method: 'POST' }),
  listarDescontos: () => apiFetch('/api/descontos'),

  validadesPorEstoque: (id) => apiFetch(`/api/validades/estoque/${id}`),
  listarStatus: () => apiFetch('/api/status'),
};

export function formatarTeleconsulta(t) {
  const data = t.data ? new Date(t.data + 'T00:00:00').toLocaleDateString('pt-BR') : '';
  const hora = t.horario ? String(t.horario).slice(0, 5) : '';
  return {
    id: t.id,
    data: `${data}${hora ? ` - ${hora}` : ''}`,
    medico: t.medico?.nome || '—',
    especialidade: t.medico?.especialidade || '—',
    paciente: t.paciente?.nome || '—',
    tipo: t.tipo || 'Teleconsulta',
    status: t.status?.nomeStatus || 'Agendada',
    horario: hora,
    raw: t,
  };
}

export function formatarReceita(r) {
  return {
    id: r.id,
    nome: r.medicamento?.nome || 'Medicamento',
    dose: r.dosagem || '—',
    freq: r.frequencia ? `${r.frequencia}x ao dia` : '—',
    validade: r.dataInicio || '—',
    status: r.status || 'Ativa',
    raw: r,
  };
}

export function formatarEstoque(e) {
  const qtd = e.quantidadeAtual ?? 0;
  const min = e.estoqueMinimo ?? 0;
  let status = e.status?.nomeStatus || 'OK';
  if (!e.status) {
    if (qtd <= min * 0.2) status = 'Crítico';
    else if (qtd <= min) status = 'Baixo';
    else status = 'OK';
  }
  return {
    id: e.id,
    nome: e.nomeProduto || e.medicamento?.nome || 'Produto',
    qtd,
    min,
    preco: Number(e.preco || 0),
    status,
    raw: e,
  };
}

export function formatarVenda(v) {
  const hora = v.data ? new Date(v.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';
  return {
    id: v.id,
    hora,
    paciente: v.paciente?.nome || 'Cliente',
    valor: Number(v.valorPago || 0),
    pagamento: v.tipoPagamento || '—',
    raw: v,
  };
}
