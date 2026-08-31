import { useEffect, useState } from 'react';
import { Modal } from './UI.jsx';
import { formatarMoeda } from '../utils/formato.js';

function ModalAgendar({ onFechar, onConfirmar, acoes }) {
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({
    idMedico: '',
    data: '',
    horario: '09:00',
    tipoConsulta: 'Teleconsulta',
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    acoes.farmagridApi.listarMedicos()
      .then(lista => {
        setMedicos(lista);
        if (lista[0]) setForm(f => ({ ...f, idMedico: String(lista[0].id) }));
      })
      .catch(() => setMedicos([]));
  }, [acoes.farmagridApi]);

  const confirmar = async () => {
    if (!acoes.usuario?.idPaciente) {
      setErro('Perfil de paciente não vinculado à API.');
      return;
    }
    if (!form.idMedico || !form.data) {
      setErro('Selecione médico e data.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      // Teleconsulta (model real) é uma tabela "achatada": idPaciente/idMedico
      // como números soltos, sem objetos aninhados, sem campo de "motivo".
      await acoes.farmagridApi.criarTeleconsulta({
        idPaciente: acoes.usuario.idPaciente,
        idMedico: Number(form.idMedico),
        data: form.data,
        horario: `${form.horario}:00`,
        tipo: form.tipoConsulta,
        duracao: '30',
        status: 'Agendada',
      });
      acoes.recarregarPainel?.();
      onConfirmar('Consulta agendada com sucesso!');
    } catch (e) {
      setErro(e.message || 'Erro ao agendar.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open title="Agendar nova consulta" onClose={onFechar} wide
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onFechar}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={confirmar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Confirmar Agendamento'}
          </button>
        </>
      }>
      {erro && <p className="login-erro">{erro}</p>}
      <div className="form-group"><label>Médico</label>
        <select value={form.idMedico} onChange={e => setForm(f => ({ ...f, idMedico: e.target.value }))}>
          {medicos.length === 0 && <option value="">Carregando médicos...</option>}
          {medicos.map(m => (
            <option key={m.id} value={m.id}>{m.nome} {m.sobrenome || ''} — {m.especialidade || 'Geral'}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group"><label>Data</label>
          <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} required />
        </div>
        <div className="form-group"><label>Horário</label>
          <select value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))}>
            {['09:00', '10:00', '14:00', '15:00', '16:00'].map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group"><label>Tipo de Consulta</label>
        <select value={form.tipoConsulta} onChange={e => setForm(f => ({ ...f, tipoConsulta: e.target.value }))}>
          <option>Teleconsulta</option>
          <option>Presencial</option>
        </select>
      </div>
    </Modal>
  );
}

export function ModaisDeAcao({ modal, onFechar, onConfirmar, acoes, dados }) {
  if (!modal) return null;

  const { tipo, dados: modalDados } = modal;

  if (tipo === 'agendar') return <ModalAgendar onFechar={onFechar} onConfirmar={onConfirmar} acoes={acoes} />;

  if (tipo === 'detalhes') {
    return (
      <Modal open title="Detalhes da Consulta" onClose={onFechar}
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={acoes.reagendar}>Reagendar</button>
            {modalDados?.tipo === 'Teleconsulta' && (
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={() => acoes.teleconsulta(modalDados)}>Entrar na Teleconsulta</button>
            )}
          </div>
        }>
        <div className="modal-info" style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
          <strong>{modalDados?.data || '—'}</strong>
          <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>{modalDados?.medico || '—'} · {modalDados?.especialidade || '—'} · {modalDados?.tipo || '—'}</p>
        </div>
        <div style={{ marginTop: 20 }}><h4>Status</h4><span className="sbadge sb-amber">{modalDados?.status || '—'}</span></div>
      </Modal>
    );
  }

  if (tipo === 'carrinho') {
    const { carrinho = [], atualizarQtdCarrinho, removerDoCarrinho, limparCarrinho, finalizarCompra } = acoes;
    const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    const totalQtd = carrinho.reduce((s, i) => s + i.qtd, 0);
    return (
      <Modal open title="Meu Carrinho" onClose={onFechar} wide
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={limparCarrinho}>Limpar Carrinho</button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={finalizarCompra}>Finalizar Compra</button>
          </div>
        }>
        {!carrinho.length ? <p style={{ color: 'var(--gray-600)' }}>Seu carrinho está vazio.</p> : carrinho.map((item, i) => (
          <div key={item.nome} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{ flex: 1 }}>
              <strong>{item.nome}</strong>
              <p style={{ color: 'var(--gray-600)', margin: '4px 0' }}>{formatarMoeda(item.preco)} cada</p>
              <p style={{ color: 'var(--green)', fontWeight: 600 }}>Subtotal: {formatarMoeda(item.preco * item.qtd)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => atualizarQtdCarrinho(i, -1)}>-</button>
              <span>{item.qtd}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => atualizarQtdCarrinho(i, 1)}>+</button>
            </div>
            <button type="button" className="btn btn-ghost" onClick={() => removerDoCarrinho(i)}>Remover</button>
          </div>
        ))}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <strong>Total ({totalQtd} itens):</strong>
          <strong style={{ color: 'var(--green)', fontSize: '1.25rem' }}>{formatarMoeda(total)}</strong>
        </div>
      </Modal>
    );
  }

  return null;
}
