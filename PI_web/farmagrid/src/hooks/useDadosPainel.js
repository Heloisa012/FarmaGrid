import { useCallback, useEffect, useState } from 'react';
import { consultas as consultasMock, medicamentos as medicamentosMock } from '../data/dadosMock.js';
import { produtosDaLoja as produtosMock } from '../data/produtosDaLoja.js';
import { farmagridApi, formatarTeleconsulta, formatarReceita } from '../services/farmagridApi.js';

const DADOS_INICIAIS = {
  consultas: consultasMock.map(c => ({
    data: c.data,
    medico: c.medico,
    especialidade: c.especialidade,
    tipo: c.tipo,
    status: c.status,
  })),
  receitas: medicamentosMock.map(m => ({
    nome: m.nome,
    dose: m.dose,
    freq: m.freq,
    dataPrescricao: '—',
    status: 'Ativa',
  })),
  // ⚠️ Loja: sem endpoint utilizável para o paciente (ver farmagridApi.js) —
  // fica sempre no catálogo mock até essa decisão de produto ser tomada.
  produtos: produtosMock,
};

export function useDadosPainel(usuario) {
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => setVersao(v => v + 1), []);

  useEffect(() => {
    if (!usuario?.idPaciente) return;

    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const [teleconsultas, receitas, medicos] = await Promise.all([
          farmagridApi.teleconsultasPorPaciente(usuario.idPaciente).catch(() => []),
          farmagridApi.receitasPorPaciente(usuario.idPaciente).catch(() => []),
          farmagridApi.listarMedicos().catch(() => []),
        ]);

        if (!ativo) return;

        // Teleconsulta não guarda nome/especialidade do médico, só idMedico
        // — junta isso aqui usando a lista de médicos disponíveis.
        const medicosPorId = Object.fromEntries((medicos || []).map(m => [m.id, m]));

        setDados(prev => ({
          ...prev,
          consultas: teleconsultas.length
            ? teleconsultas.map(t => formatarTeleconsulta(t, medicosPorId))
            : prev.consultas,
          receitas: receitas.length ? receitas.map(formatarReceita) : prev.receitas,
        }));
      } catch (e) {
        if (ativo) setErro(e.message || 'Erro ao carregar dados da API.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [usuario?.idPaciente, versao]);

  return { dados, carregando, erro, recarregar };
}
