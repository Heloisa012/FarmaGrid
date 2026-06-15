import { useCallback, useEffect, useState } from 'react';
import { consultas as consultasMock, medicamentos as medicamentosMock } from '../data/dadosMock.js';
import { produtosDaLoja as produtosMock } from '../data/produtosDaLoja.js';
import {
  farmagridApi,
  formatarTeleconsulta,
  formatarReceita,
  formatarEstoque,
  formatarVenda,
} from '../services/farmagridApi.js';

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
    validade: m.validade,
    status: 'Ativa',
  })),
  medicamentos: medicamentosMock,
  produtos: produtosMock,
  pacientes: [],
  medicos: [],
  parcerias: [],
  estoques: [],
  vendas: [],
  prontuarios: [],
};

export function useDadosPainel(usuario, tipoPerfil) {
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => setVersao(v => v + 1), []);

  useEffect(() => {
    if (!usuario?.id) return;

    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        if (tipoPerfil === 'paciente' && usuario.idPaciente) {
          const [teleconsultas, receitas, medicamentos] = await Promise.all([
            farmagridApi.teleconsultasPorPaciente(usuario.idPaciente).catch(() => []),
            farmagridApi.receitasPorPaciente(usuario.idPaciente).catch(() => []),
            farmagridApi.listarMedicamentos().catch(() => []),
          ]);

          if (!ativo) return;
          setDados(prev => ({
            ...prev,
            consultas: teleconsultas.length ? teleconsultas.map(formatarTeleconsulta) : prev.consultas,
            receitas: receitas.length ? receitas.map(formatarReceita) : prev.receitas,
            medicamentos: medicamentos.length
              ? medicamentos.map(m => ({
                  id: m.id,
                  nome: m.nome,
                  dose: m.dosagem || '—',
                  freq: '—',
                  validade: m.dataValidade || '—',
                }))
              : prev.medicamentos,
            produtos: medicamentos.length
              ? medicamentos.map(m => ({
                  id: m.id,
                  nome: m.nome,
                  sub: m.categoria || m.fabricante || '',
                  orig: Number(m.preco || 0) * 1.5,
                  desc: Number(m.preco || 0),
                  badge: 'Clube FarmaGrid',
                  badgeCls: 'badge-green',
                }))
              : prev.produtos,
          }));
        }

        if (tipoPerfil === 'profissional' && usuario.idMedico) {
          const [teleconsultas, pacientes, parcerias, estoques, medicamentos] = await Promise.all([
            farmagridApi.teleconsultasPorMedico(usuario.idMedico).catch(() => []),
            farmagridApi.listarPacientes().catch(() => []),
            farmagridApi.listarParcerias().catch(() => []),
            farmagridApi.listarEstoques().catch(() => []),
            farmagridApi.listarMedicamentos().catch(() => []),
          ]);

          if (!ativo) return;
          setDados(prev => ({
            ...prev,
            consultas: teleconsultas.length ? teleconsultas.map(formatarTeleconsulta) : prev.consultas,
            pacientes,
            parcerias,
            medicamentos,
            estoques: estoques.length ? estoques.map(formatarEstoque) : prev.estoques,
          }));
        }

        if (tipoPerfil === 'farmacia') {
          const [estoques, vendas, descontos, medicamentos] = await Promise.all([
            farmagridApi.listarEstoques().catch(() => []),
            farmagridApi.vendasHoje().catch(() => []),
            farmagridApi.listarDescontos().catch(() => []),
            farmagridApi.listarMedicamentos().catch(() => []),
          ]);

          if (!ativo) return;
          setDados(prev => ({
            ...prev,
            estoques: estoques.length ? estoques.map(formatarEstoque) : prev.estoques,
            vendas: vendas.length ? vendas.map(formatarVenda) : prev.vendas,
            descontos,
            medicamentos,
          }));
        }
      } catch (e) {
        if (ativo) setErro(e.message || 'Erro ao carregar dados da API.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [usuario?.id, usuario?.idPaciente, usuario?.idMedico, tipoPerfil, versao]);

  return { dados, carregando, erro, recarregar };
}
