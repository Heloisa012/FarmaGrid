export const TELECONSULTA_MEET_URL = 'https://meet.google.com';

export const consultas = [
  { data: '15/11/2025 - 14:00', medico: 'Dr. João Santos',  especialidade: 'Cardiologia',   tipo: 'Teleconsulta', status: 'Confirmada', meetUrl: TELECONSULTA_MEET_URL },
  { data: '20/11/2025 - 10:30', medico: 'Dra. Ana Costa',   especialidade: 'Dermatologia',  tipo: 'Presencial',   status: 'Pendente'   },
  { data: '05/12/2025 - 09:00', medico: 'Dr. Carlos Lima',  especialidade: 'Clínica Geral', tipo: 'Teleconsulta', status: 'Confirmada', meetUrl: TELECONSULTA_MEET_URL },
];

export const medicamentos = [
  { nome: 'Losartana',    dose: '50mg',  freq: '1x ao dia', validade: '15/12/2025' },
  { nome: 'Sinvastatina', dose: '20mg',  freq: '1x ao dia', validade: '15/12/2025' },
  { nome: 'Metformina',   dose: '500mg', freq: '2x ao dia', validade: '28/01/2026' },
];

export const exames = [
  { nome: 'Hemograma Completo', medico: 'Dr. João Santos', data: '10/11/2025', status: 'Disponível' },
  { nome: 'Colesterol Total',   medico: 'Dra. Ana Costa',  data: '05/10/2025', status: 'Disponível' },
  { nome: 'Glicemia em Jejum',  medico: 'Dr. Carlos Lima', data: '20/09/2025', status: 'Disponível' },
];

export const itensDaLoja = [
  { nome: 'Losartana 50mg',    cat: 'Anti-hipertensivo', orig: 'R$ 28,90', desc: 'R$ 18,99' },
  { nome: 'Sinvastatina 20mg', cat: 'Colesterol',        orig: 'R$ 45,00', desc: 'R$ 29,90' },
  { nome: 'Metformina 500mg',  cat: 'Antidiabético',     orig: 'R$ 32,00', desc: 'R$ 21,50' },
  { nome: 'Omeprazol 20mg',    cat: 'Antiácido',         orig: 'R$ 22,00', desc: 'R$ 14,90' },
  { nome: 'Amoxicilina 500mg', cat: 'Antibiótico',       orig: 'R$ 38,00', desc: 'R$ 24,90' },
  { nome: 'Atenolol 25mg',     cat: 'Cardíaco',          orig: 'R$ 19,00', desc: 'R$ 12,90' },
];

export const beneficiosClube = [
  ['Até 60% de desconto',        'Em mais de 5.000 medicamentos'],
  ['Entrega grátis',             'Para compras acima de R$ 30'],
  ['Prioridade no atendimento',  'Tempo de espera reduzido em até 80%'],
  ['Cashback de 5%',             'Em todas as compras na loja'],
];

export const consultasProfissional = [
  { horario: '09:00', paciente: 'Maria Silva',    tipo: 'Retorno',           status: 'Confirmada', idade: 45, meetUrl: TELECONSULTA_MEET_URL },
  { horario: '10:00', paciente: 'José Pereira',   tipo: 'Primeira Consulta', status: 'Confirmada', idade: 62, meetUrl: TELECONSULTA_MEET_URL },
  { horario: '11:00', paciente: 'Ana Rodrigues',  tipo: 'Urgência',          status: 'Aguardando', idade: 31, meetUrl: TELECONSULTA_MEET_URL },
  { horario: '14:00', paciente: 'Carlos Mendes',  tipo: 'Retorno',           status: 'Confirmada', idade: 55, meetUrl: TELECONSULTA_MEET_URL },
];

export const pedidosFarmacia = [
  { id: '#4521', paciente: 'Maria Silva',   itens: 'Losartana 50mg x2',    valor: 'R$ 45,80', status: 'Separando' },
  { id: '#4520', paciente: 'José Pereira',  itens: 'Metformina 500mg x3',  valor: 'R$ 38,20', status: 'Entregue'  },
  { id: '#4519', paciente: 'Ana Rodrigues', itens: 'Amoxicilina 500mg',    valor: 'R$ 22,50', status: 'Aguardando'},
  { id: '#4518', paciente: 'Carlos Mendes', itens: 'Atenolol 25mg x2',     valor: 'R$ 18,90', status: 'Entregue'  },
];

export const estoque = [
  { nome: 'Dipirona 500mg',    qtd: 8,  min: 20, status: 'Crítico' },
  { nome: 'Amoxicilina 500mg', qtd: 45, min: 30, status: 'OK'      },
  { nome: 'Losartana 50mg',    qtd: 15, min: 25, status: 'Baixo'   },
  { nome: 'Metformina 500mg',  qtd: 62, min: 20, status: 'OK'      },
  { nome: 'Omeprazol 20mg',    qtd: 3,  min: 15, status: 'Crítico' },
];

export const clientesFarmacia = [
  { nome: 'Maria Silva',   plano: 'Premium', ultimaCompra: '10/11/2025', total: 'R$ 847',   status: 'Ativo' },
  { nome: 'José Pereira',  plano: 'Básico',  ultimaCompra: '08/11/2025', total: 'R$ 234',   status: 'Ativo' },
  { nome: 'Ana Rodrigues', plano: 'Premium', ultimaCompra: '12/11/2025', total: 'R$ 1.203', status: 'Ativo' },
  { nome: 'Carlos Mendes', plano: 'Básico',  ultimaCompra: '05/11/2025', total: 'R$ 89',    status: 'Ativo' },
];

export const maisPedidos = [
  { nome: 'Losartana 50mg',    qtd: '342', receita: 'R$ 6.184', margem: '35%' },
  { nome: 'Metformina 500mg',  qtd: '298', receita: 'R$ 4.172', margem: '28%' },
  { nome: 'Omeprazol 20mg',    qtd: '276', receita: 'R$ 3.312', margem: '40%' },
  { nome: 'Sinvastatina 20mg', qtd: '215', receita: 'R$ 4.085', margem: '32%' },
];
