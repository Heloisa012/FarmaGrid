export const TELECONSULTA_MEET_URL = 'https://meet.google.com/exemplo-farmagrid';

export const consultas = [
  {
    id: 1,
    data: '15/12/2025 - 10:00',
    medico: 'Dr. João Santos',
    especialidade: 'Cardiologia',
    tipo: 'Teleconsulta',
    status: 'Confirmada',
  },
  {
    id: 2,
    data: '20/12/2025 - 14:30',
    medico: 'Dra. Ana Costa',
    especialidade: 'Clínica Geral',
    tipo: 'Presencial',
    status: 'Agendada',
  },
];

export const medicamentos = [
  { id: 1, nome: 'Losartana 50mg', dose: '50mg', freq: '1x ao dia', validade: '15/06/2026' },
  { id: 2, nome: 'Sinvastatina 20mg', dose: '20mg', freq: '1x à noite', validade: '20/08/2026' },
];
