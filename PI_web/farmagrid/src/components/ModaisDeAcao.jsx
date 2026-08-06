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
    motivo: '',
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
      await acoes.farmagridApi.criarTeleconsulta({
        paciente: { id: acoes.usuario.idPaciente },
        medico: { id: Number(form.idMedico) },
        data: form.data,
        horario: `${form.horario}:00`,
        tipo: form.tipoConsulta,
        duracaoMinutos: 30,
        relatorio: form.motivo || null,
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
            <option key={m.id} value={m.id}>{m.nome} — {m.especialidade || 'Geral'}</option>
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
      <div className="form-group"><label>Motivo da Consulta</label>
        <textarea rows={3} value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Descreva brevemente o motivo" />
      </div>
    </Modal>
  );
}

function ModalNovaConsulta({ onFechar, onConfirmar, acoes, pacientes = [] }) {
  const [form, setForm] = useState({ idPaciente: '', data: '', horario: '09:00', tipo: 'Teleconsulta', motivo: '' });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [listaPacientes, setListaPacientes] = useState(pacientes);

  useEffect(() => {
    if (listaPacientes.length) {
      setForm(f => ({ ...f, idPaciente: String(listaPacientes[0].id) }));
      return;
    }
    acoes.farmagridApi.listarPacientes()
      .then(lista => {
        setListaPacientes(lista);
        if (lista[0]) setForm(f => ({ ...f, idPaciente: String(lista[0].id) }));
      })
      .catch(() => setListaPacientes([]));
  }, [acoes.farmagridApi, listaPacientes.length]);

  const salvar = async () => {
    if (!acoes.usuario?.idMedico || !form.idPaciente || !form.data) {
      setErro('Preencha paciente, data e horário.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      await acoes.farmagridApi.criarTeleconsulta({
        paciente: { id: Number(form.idPaciente) },
        medico: { id: acoes.usuario.idMedico },
        data: form.data,
        horario: `${form.horario}:00`,
        tipo: form.tipo,
        duracaoMinutos: 30,
        relatorio: form.motivo || null,
      });
      acoes.recarregarPainel?.();
      onConfirmar('Nova consulta cadastrada com sucesso!');
    } catch (e) {
      setErro(e.message || 'Erro ao salvar consulta.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open title="Nova Consulta" onClose={onFechar} wide
      footer={
        <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Consulta'}
        </button>
      }>
      {erro && <p className="login-erro">{erro}</p>}
      <div className="form-group"><label>Paciente</label>
        <select value={form.idPaciente} onChange={e => setForm(f => ({ ...f, idPaciente: e.target.value }))}>
          {listaPacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group"><label>Data</label>
          <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
        </div>
        <div className="form-group"><label>Horário</label>
          <input type="time" value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} />
        </div>
      </div>
      <div className="form-group"><label>Tipo</label>
        <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
          <option>Teleconsulta</option><option>Presencial</option><option>Retorno</option>
        </select>
      </div>
      <div className="form-group"><label>Motivo</label>
        <textarea rows={4} value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} />
      </div>
    </Modal>
  );
}

function ModalReceita({ onFechar, onConfirmar, acoes, dados }) {
  const pacienteNome = typeof dados?.paciente === 'string' ? dados.paciente : dados?.paciente?.nome;
  const pacientes = dados?.pacientes || [];
  const medicamentos = dados?.medicamentos || [];

  const pacienteEncontrado = pacientes.find(p => p.nome === pacienteNome);
  const [form, setForm] = useState({
    idPaciente: pacienteEncontrado ? String(pacienteEncontrado.id) : '',
    idMedicamento: '',
    dosagem: '',
    frequencia: 1,
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (medicamentos[0] && !form.idMedicamento) {
      setForm(f => ({ ...f, idMedicamento: String(medicamentos[0].id) }));
    }
  }, [medicamentos, form.idMedicamento]);

  const emitir = async () => {
    if (!form.idPaciente || !form.idMedicamento) {
      setErro('Selecione paciente e medicamento.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      await acoes.farmagridApi.criarReceita({
        paciente: { id: Number(form.idPaciente) },
        medicamento: { id: Number(form.idMedicamento) },
        dosagem: form.dosagem || '—',
        frequencia: Number(form.frequencia) || 1,
        dataInicio: new Date().toISOString().slice(0, 10),
        status: 'ATIVA',
      });
      acoes.recarregarPainel?.();
      onConfirmar('Receita criada com sucesso!');
    } catch (e) {
      setErro(e.message || 'Erro ao emitir receita.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open title="Nova Receita Digital" onClose={onFechar}
      footer={
        <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={emitir} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Assinar e Emitir Receita'}
        </button>
      }>
      {erro && <p className="login-erro">{erro}</p>}
      <div className="form-group"><label>Paciente</label>
        <select value={form.idPaciente} onChange={e => setForm(f => ({ ...f, idPaciente: e.target.value }))}>
          <option value="">Selecione...</option>
          {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>
      <div className="form-group"><label>Medicamento</label>
        <select value={form.idMedicamento} onChange={e => setForm(f => ({ ...f, idMedicamento: e.target.value }))}>
          {medicamentos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
        </select>
      </div>
      <div className="form-group"><label>Dosagem</label>
        <input type="text" value={form.dosagem} onChange={e => setForm(f => ({ ...f, dosagem: e.target.value }))} placeholder="Ex: 50mg" />
      </div>
      <div className="form-group"><label>Frequência (vezes ao dia)</label>
        <input type="number" min={1} value={form.frequencia} onChange={e => setForm(f => ({ ...f, frequencia: e.target.value }))} />
      </div>
    </Modal>
  );
}

function ModalNovaParceria({ onFechar, onConfirmar, acoes }) {
  const [form, setForm] = useState({ nome: '', tipo: 'Clínica', email: '', telefone: '' });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const salvar = async () => {
    if (!form.nome) { setErro('Informe o nome da instituição.'); return; }
    setSalvando(true);
    setErro('');
    try {
      await acoes.farmagridApi.criarParceria({
        nome: form.nome,
        tipo: form.tipo,
        email: form.email || null,
        telefone: form.telefone || null,
        status: 'ATIVA',
        dataInicio: new Date().toISOString().slice(0, 10),
        pacientesEncaminhados: 0,
      });
      acoes.recarregarPainel?.();
      onConfirmar('Nova parceria cadastrada com sucesso!');
    } catch (e) {
      setErro(e.message || 'Erro ao salvar parceria.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open title="Nova Parceria" onClose={onFechar} wide
      footer={
        <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Parceria'}
        </button>
      }>
      {erro && <p className="login-erro">{erro}</p>}
      <div className="form-group"><label>Nome da Instituição</label>
        <input type="text" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group"><label>Tipo</label>
          <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
            <option>Clínica</option><option>Farmácia</option><option>Convênio</option>
          </select>
        </div>
        <div className="form-group"><label>Telefone</label>
          <input type="text" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} />
        </div>
      </div>
      <div className="form-group"><label>Email</label>
        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
    </Modal>
  );
}

function ModalAdicionarEstoque({ onFechar, onConfirmar, acoes }) {
  const [form, setForm] = useState({ nomeProduto: '', quantidade: 10, minimo: 5, preco: 0 });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const salvar = async () => {
    if (!form.nomeProduto) { setErro('Informe o nome do produto.'); return; }
    setSalvando(true);
    setErro('');
    try {
      await acoes.farmagridApi.criarEstoque({
        nomeProduto: form.nomeProduto,
        quantidadeAtual: Number(form.quantidade) || 0,
        estoqueMinimo: Number(form.minimo) || 0,
        preco: Number(form.preco) || 0,
        categoria: 'Medicamento',
      });
      acoes.recarregarPainel?.();
      onConfirmar('Produto adicionado ao estoque com sucesso.');
    } catch (e) {
      setErro(e.message || 'Erro ao salvar produto.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open title="Adicionar Produto ao Estoque" onClose={onFechar} wide
      footer={
        <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Produto'}
        </button>
      }>
      {erro && <p className="login-erro">{erro}</p>}
      <div className="form-group"><label>Nome do Produto</label>
        <input type="text" value={form.nomeProduto} onChange={e => setForm(f => ({ ...f, nomeProduto: e.target.value }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="form-group"><label>Quantidade</label>
          <input type="number" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} />
        </div>
        <div className="form-group"><label>Estoque mínimo</label>
          <input type="number" value={form.minimo} onChange={e => setForm(f => ({ ...f, minimo: e.target.value }))} />
        </div>
        <div className="form-group"><label>Preço (R$)</label>
          <input type="number" step="0.01" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} />
        </div>
      </div>
    </Modal>
  );
}

function ModalNovaVenda({ onFechar, onConfirmar, acoes }) {
  const [form, setForm] = useState({ valor: '', pagamento: 'PIX' });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const finalizar = async () => {
    const valor = Number(form.valor);
    if (!valor || valor <= 0) { setErro('Informe um valor válido.'); return; }
    setSalvando(true);
    setErro('');
    try {
      await acoes.farmagridApi.criarVenda({
        data: new Date().toISOString().slice(0, 19),
        tipoPagamento: form.pagamento,
        valorPago: valor,
      });
      acoes.recarregarPainel?.();
      onConfirmar('Venda registrada com sucesso.');
    } catch (e) {
      setErro(e.message || 'Erro ao registrar venda.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open title="Nova Venda" onClose={onFechar} wide
      footer={
        <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={finalizar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Finalizar Venda'}
        </button>
      }>
      {erro && <p className="login-erro">{erro}</p>}
      <div className="form-group"><label>Valor total (R$)</label>
        <input type="number" step="0.01" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} />
      </div>
      <div className="form-group"><label>Pagamento</label>
        <select value={form.pagamento} onChange={e => setForm(f => ({ ...f, pagamento: e.target.value }))}>
          <option>PIX</option><option>Cartão Débito</option><option>Cartão Crédito</option><option>Dinheiro</option>
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
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={acoes.teleconsulta}>Entrar na Teleconsulta</button>
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

  if (tipo === 'prontuario') {
    return (
      <Modal open title="Prontuário da Consulta" onClose={onFechar} wide
        footer={<button type="button" className="btn btn-primary" onClick={() => acoes.exportarPdf()}>Exportar PDF</button>}>
        <div className="modal-info" style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <h4>{acoes.usuario?.nome || 'Profissional'}</h4>
          <p style={{ color: 'var(--gray-600)' }}>Prontuário eletrônico FarmaGrid</p>
        </div>
        {[['Queixa Principal', 'Registro clínico do paciente.'],
          ['Diagnóstico', 'A definir após avaliação.'],
          ['Conduta Médica', 'Prescrição e orientações registradas na API.'],
        ].map(([t, d]) => (
          <div key={t} style={{ marginBottom: 16 }}><h4>{t}</h4><p>{d}</p></div>
        ))}
      </Modal>
    );
  }

  if (tipo === 'receita') return <ModalReceita onFechar={onFechar} onConfirmar={onConfirmar} acoes={acoes} dados={{ ...dados, paciente: modalDados?.paciente, pacientes: dados?.pacientes }} />;

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

  if (tipo === 'novaConsulta') return <ModalNovaConsulta onFechar={onFechar} onConfirmar={onConfirmar} acoes={acoes} pacientes={dados?.pacientes} />;
  if (tipo === 'novaParceria') return <ModalNovaParceria onFechar={onFechar} onConfirmar={onConfirmar} acoes={acoes} />;
  if (tipo === 'adicionarProduto' || tipo === 'adicionarProdutoEstoque') {
    return <ModalAdicionarEstoque onFechar={onFechar} onConfirmar={onConfirmar} acoes={acoes} />;
  }
  if (tipo === 'novaVenda') return <ModalNovaVenda onFechar={onFechar} onConfirmar={onConfirmar} acoes={acoes} />;

  if (tipo === 'scannerQR') {
    return (
      <Modal open title="Escanear QR Code da Receita" onClose={onFechar}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ width: 280, height: 280, background: 'var(--gray-200)', borderRadius: 8, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            📷 Scanner QR Code
          </div>
          <p style={{ marginTop: 20, color: 'var(--gray-600)' }}>Posicione o QR Code da receita em frente à câmera</p>
        </div>
      </Modal>
    );
  }

  if (tipo === 'verReceita') {
    return (
      <Modal open title="Receita Digital" onClose={onFechar} wide
        footer={<button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={acoes.dispensar}>Dispensar Medicamento</button>}>
        <div style={{ padding: 16, background: '#dcfce7', borderRadius: 8 }}>
          <strong style={{ color: '#16a34a' }}>✓ Receita validada via API FarmaGrid</strong>
        </div>
      </Modal>
    );
  }

  if (tipo === 'listaVencimento') {
    return (
      <Modal open title="Produtos Próximos ao Vencimento" onClose={onFechar} wide>
        <table className="table">
          <thead><tr><th>Produto</th><th>Qtd</th><th>Status</th></tr></thead>
          <tbody>
            {(dados?.estoques || []).slice(0, 10).map(e => (
              <tr key={e.id || e.nome}><td>{e.nome}</td><td>{e.qtd}</td><td>{e.status}</td></tr>
            ))}
          </tbody>
        </table>
      </Modal>
    );
  }

  return null;
}
