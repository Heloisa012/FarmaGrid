import { SBadge, StatCard } from '../components/UI.jsx';
import { ICalendario, IArquivo, IDinheiro, IRelogio, ICarrinho } from '../components/Icones.jsx';
import { produtosDaLoja } from '../data/produtosDaLoja.js';
import { formatarMoeda } from '../utils/formato.js';

function VisaoGeral({ acoes, dados, usuario }) {
  const consultas = dados?.consultas || [];
  const receitas = dados?.receitas || [];
  const proxima = consultas[0];

  return <>
    <div className="dashboard-header">
      <div><h2>Bem-vinda, {usuario?.nome?.split(' ')[0] || 'Maria'}!</h2><p>Aqui está um resumo da sua saúde</p></div>
      <button type="button" className="btn btn-primary" onClick={acoes.agendar}>+ Nova Consulta</button>
    </div>
    <div className="stats-row">
      <StatCard label="Próxima Consulta" IcoComp={ICalendario} value={proxima?.data?.split(' - ')[0] || '—'} sub={proxima ? `${proxima.medico} · ${proxima.especialidade}` : 'Nenhuma agendada'} />
      <StatCard label="Receitas Ativas" IcoComp={IArquivo} value={String(receitas.length)} sub="Registradas na API" subCls="stat-positive" />
      <StatCard label="Economia no Clube" IcoComp={IDinheiro} value="R$ 847" sub="Este mês" subCls="stat-positive" />
      <StatCard label="Consultas" IcoComp={IRelogio} value={String(consultas.length)} sub="Total registradas" />
    </div>
    <div className="card">
      <div className="card-header">
        <h3>Próximas Consultas</h3>
        <button type="button" className="btn btn-secondary" onClick={() => acoes.setSecao('consultas')}>Ver Todas</button>
      </div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Data</th><th>Médico</th><th>Especialidade</th><th>Tipo</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {consultas.slice(0, 5).map(c => (
            <tr key={c.id || c.data}>
              <td>{c.data}</td><td>{c.medico}</td><td>{c.especialidade}</td><td>{c.tipo}</td>
              <td><SBadge s={c.status} /></td>
              <td>
                {c.tipo === 'Teleconsulta'
                  ? <button type="button" className="btn btn-primary btn-sm" onClick={() => acoes.teleconsulta(c)}>Entrar</button>
                  : <button type="button" className="btn btn-secondary btn-sm" onClick={() => acoes.detalhes(c)}>Detalhes</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
    <div className="card">
      <div className="card-header"><h3>Medicamentos em Uso</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Medicamento</th><th>Dosagem</th><th>Frequência</th><th>Prescrita em</th></tr></thead>
        <tbody>{receitas.map(m => (
          <tr key={m.id || m.nome}><td>{m.nome}</td><td>{m.dose}</td><td>{m.freq}</td><td>{m.dataPrescricao}</td></tr>
        ))}</tbody>
      </table></div>
    </div>
  </>;
}

function Consultas({ acoes, dados }) {
  const consultas = dados?.consultas || [];
  return <>
    <div className="dashboard-header">
      <div><h2>Minhas Consultas</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.agendar}>Agendar Nova Consulta</button>
    </div>
    <div className="card">
      <div className="card-header"><h3>Consultas Agendadas</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Data e Hora</th><th>Médico</th><th>Especialidade</th><th>Tipo</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {consultas.map(c => (
            <tr key={c.id || c.data}>
              <td>{c.data}</td><td>{c.medico}</td><td>{c.especialidade}</td><td>{c.tipo}</td>
              <td><SBadge s={c.status} /></td>
              <td>
                {c.tipo === 'Teleconsulta'
                  ? <button type="button" className="btn btn-primary btn-sm" onClick={() => acoes.teleconsulta(c)}>Entrar na Chamada</button>
                  : <button type="button" className="btn btn-secondary btn-sm" onClick={() => acoes.detalhes(c)}>Ver Detalhes</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  </>;
}

function Exames({ acoes, dados }) {
  const receitas = dados?.receitas || [];
  return <>
    <div className="dashboard-header"><h2>Exames e Receitas</h2></div>
    <div className="card">
      <div className="card-header"><h3>Receitas Digitais Ativas</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Medicamento</th><th>Dosagem</th><th>Prescrita em</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {receitas.map(m => (
            <tr key={m.id || m.nome}>
              <td><strong>{m.nome} {m.dose}</strong></td><td>{m.dose}</td><td>{m.dataPrescricao}</td>
              <td><SBadge s={m.status || 'Ativa'} /></td>
              <td><button type="button" className="btn btn-primary btn-sm">Ver QR Code</button></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  </>;
}

function Loja({ acoes, dados }) {
  const produtos = dados?.produtos || produtosDaLoja;
  const qtdCarrinho = acoes.carrinho?.reduce((s, i) => s + i.qtd, 0) || 0;

  return <>
    <div className="page-header">
      <div><h2>Loja de Medicamentos</h2><p>Compre com desconto do clube FarmaGrid</p></div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="search-bar"><input type="text" placeholder="Buscar medicamentos..." /></div>
        <button type="button" className="btn btn-secondary" onClick={acoes.abrirCarrinho}>
          <ICarrinho /> Carrinho ({qtdCarrinho})
        </button>
      </div>
    </div>
    <div className="product-grid">
      {produtos.map(p => (
        <div className="product-card" key={p.nome}>
          <div className="product-badge"><span className={`badge ${p.badgeCls || 'badge-green'}`}>{p.badge || 'Clube'}</span></div>
          <div className="product-name">{p.nome}</div>
          <div className="product-sub">{p.sub}</div>
          <div className="product-price-row">
            <span className="price-original">{formatarMoeda(p.orig)}</span>
            <span className="price-discounted">{formatarMoeda(p.desc)}</span>
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => acoes.adicionarAoCarrinho(`${p.nome}`, p.desc, p.orig)}>
            Adicionar ao Carrinho
          </button>
        </div>
      ))}
    </div>
  </>;
}

function Clube() {
  return <>
    <div className="dashboard-header"><div><h2>Clube de Descontos</h2><p>Até 60% de desconto com seu Plano Premium</p></div></div>
    <div className="card">
      <div className="card-header"><h3>Benefícios do Clube Premium</h3></div>
      {[
        ['Até 60% de desconto em medicamentos', 'Em mais de 15.000 produtos'],
        ['Frete grátis em compras acima de R$ 50', 'Entrega em todo Brasil'],
        ['5% de cashback em todas as compras', 'Para usar em próximas compras'],
      ].map(([t, d]) => (
        <div className="alert-row" key={t}><div className="alert-text"><strong>{t}</strong><span>{d}</span></div></div>
      ))}
    </div>
  </>;
}

const SECOES = { visaoGeral: VisaoGeral, consultas: Consultas, exames: Exames, loja: Loja, clube: Clube };

export function PainelPaciente({ secao, acoes, dados, usuario }) {
  const SecaoAtual = SECOES[secao] || VisaoGeral;
  return <SecaoAtual acoes={acoes} dados={dados} usuario={usuario} />;
}
