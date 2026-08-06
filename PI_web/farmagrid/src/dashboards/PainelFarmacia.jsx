import { SBadge, StatCard } from '../components/UI.jsx';
import { IDinheiro, ICarrinho, IAlerta, IUsuarios, IGrafico } from '../components/Icones.jsx';
import { formatarMoeda } from '../utils/formato.js';

function VisaoGeral({ acoes, dados }) {
  const estoques = dados?.estoques || [];
  const vendas = dados?.vendas || [];
  const totalVendas = vendas.reduce((s, v) => s + v.valor, 0);
  const criticos = estoques.filter(e => e.status === 'Crítico').length;

  return <>
    <div className="dashboard-header">
      <div><h2>Dashboard da Farmácia</h2><p>Visão geral operacional</p></div>
    </div>
    <div className="stats-row">
      <StatCard label="Vendas Hoje" IcoComp={IDinheiro} value={formatarMoeda(totalVendas || 0)} sub={`${vendas.length} vendas`} subCls="stat-positive" />
      <StatCard label="Receitas Dispensadas" IcoComp={ICarrinho} value={String(vendas.length)} sub="Hoje" />
      <StatCard label="Produtos em Falta" IcoComp={IAlerta} value={String(criticos)} sub="Requer atenção" subCls="stat-negative" />
      <StatCard label="Clientes Ativos" IcoComp={IUsuarios} value="1.247" sub="+52 este mês" subCls="stat-positive" />
    </div>
    <div className="card">
      <div className="card-header"><h3>Alertas Críticos</h3></div>
      <div className="alert-box danger" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><strong>🔴 Losartana 50mg - Estoque Crítico</strong><p>Apenas 5 unidades | Mínimo: 50</p></div>
        <button type="button" className="btn btn-primary btn-sm" onClick={acoes.solicitarReposicao}>Solicitar Reposição</button>
      </div>
      <div className="alert-box warn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><strong>⚠️ Sensor RFID Setor C - Temperatura Alta</strong><p>Temperatura: 26°C | Limite: 25°C</p></div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={acoes.verificarSensor}>Verificar</button>
      </div>
      <div className="alert-box warn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><strong>⚠️ 3 Produtos próximos ao vencimento</strong></div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={acoes.listaVencimento}>Ver Lista</button>
      </div>
    </div>
    <div className="two-col">
      <div className="card">
        <div className="card-header"><h3>Últimas Dispensações</h3></div>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Horário</th><th>Paciente</th><th>Medicamento</th><th>Valor</th></tr></thead>
          <tbody>
            {(vendas.length ? vendas : [{ hora: '—', paciente: 'Sem vendas', valor: 0 }]).slice(0, 5).map(v => (
              <tr key={v.id || v.hora + v.paciente}><td>{v.hora}</td><td>{v.paciente}</td><td>—</td><td>{formatarMoeda(v.valor)}</td></tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <div className="card">
        <div className="card-header"><h3>Top 5 Produtos</h3></div>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Produto</th><th>Vendas</th><th>Receita</th></tr></thead>
          <tbody>
            <tr><td>Losartana 50mg</td><td>127</td><td>R$ 2.331,72</td></tr>
            <tr><td>Sinvastatina 20mg</td><td>98</td><td>R$ 2.038,40</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </>;
}

function Dispensacao({ acoes }) {
  return <>
    <div className="dashboard-header">
      <div><h2>Dispensação de Receitas Eletrônicas</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.scannerQR}>Escanear QR Code</button>
    </div>
    <div className="card">
      <div className="card-header"><h3>Receitas Pendentes</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Código</th><th>Paciente</th><th>Médico</th><th>Medicamento</th><th>Validade</th><th>Ações</th></tr></thead>
        <tbody>
          <tr>
            <td>RX-001234</td><td>Maria Silva</td><td>Dr. João Santos</td><td>Losartana 50mg</td><td>15/12/2025</td>
            <td style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={acoes.dispensar}>Dispensar</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={acoes.verReceita}>Ver Receita</button>
            </td>
          </tr>
          <tr>
            <td>RX-001235</td><td>Pedro Costa</td><td>Dr. João Santos</td><td>Metformina 850mg</td><td>18/12/2025</td>
            <td style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={acoes.dispensar}>Dispensar</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={acoes.verReceita}>Ver Receita</button>
            </td>
          </tr>
        </tbody>
      </table></div>
    </div>
  </>;
}

function Estoque({ acoes, dados }) {
  const estoques = dados?.estoques || [];
  const criticos = estoques.filter(e => e.status === 'Crítico' || e.status === 'Baixo');
  return <>
    <div className="dashboard-header">
      <div><h2>Controle de Estoque RFID</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.adicionarProdutoEstoque}>Adicionar Produto</button>
    </div>
    <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard label="Total de SKUs" IcoComp={IAlerta} value={String(estoques.length)} sub="Produtos cadastrados" />
      <StatCard label="Alertas" IcoComp={IDinheiro} value={String(criticos.length)} sub="Baixo ou crítico" subCls={criticos.length ? 'stat-negative' : 'stat-positive'} />
    </div>
    <div className="card">
      <div className="card-header"><h3>Produtos em Estoque</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Produto</th><th>Qtd</th><th>Mín</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {(estoques.length ? estoques : [{ nome: 'Nenhum produto', qtd: 0, min: 0, preco: 0, status: '—' }]).map(e => (
            <tr key={e.id || e.nome}>
              <td>{e.nome}</td><td>{e.qtd}</td><td>{e.min}</td><td>{formatarMoeda(e.preco || 0)}</td>
              <td><SBadge s={e.status} /></td>
              <td>{e.status === 'Crítico' || e.status === 'Baixo'
                ? <button type="button" className="btn btn-primary btn-sm" onClick={acoes.repor}>Repor</button>
                : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  </>;
}

function Vendas({ acoes, dados }) {
  const vendas = dados?.vendas || [];
  const total = vendas.reduce((s, v) => s + v.valor, 0);
  return <>
    <div className="dashboard-header">
      <div><h2>Gestão de Vendas</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.novaVenda}>Nova Venda</button>
    </div>
    <div className="stats-row">
      <StatCard label="Vendas Hoje" IcoComp={IDinheiro} value={formatarMoeda(total)} sub={`${vendas.length} vendas`} subCls="stat-positive" />
      <StatCard label="Ticket Médio" IcoComp={ICarrinho} value={formatarMoeda(vendas.length ? total / vendas.length : 0)} sub="Hoje" />
    </div>
    <div className="card">
      <div className="card-header"><h3>Vendas de Hoje</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Horário</th><th>Cliente</th><th>Total</th><th>Pagamento</th></tr></thead>
        <tbody>
          {(vendas.length ? vendas : [{ hora: '—', paciente: 'Sem vendas', valor: 0, pagamento: '—' }]).map(v => (
            <tr key={v.id || v.hora + v.paciente}>
              <td>{v.hora}</td><td>{v.paciente}</td><td><strong>{formatarMoeda(v.valor)}</strong></td><td>{v.pagamento}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  </>;
}

function Relatorios({ acoes }) {
  return <>
    <div className="dashboard-header">
      <div><h2>Relatórios e Análises</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.exportarPdf}>Exportar Relatório</button>
    </div>
    <div className="stats-row">
      <StatCard label="Faturamento (Nov)" IcoComp={IDinheiro} value="R$ 187k" sub="+15.3%" subCls="stat-positive" />
      <StatCard label="Lucro Líquido" IcoComp={IGrafico} value="R$ 52k" sub="+18.7%" subCls="stat-positive" />
      <StatCard label="Margem" IcoComp={ICarrinho} value="27.8%" sub="+2.1pp" subCls="stat-positive" />
      <StatCard label="ROI Clube" IcoComp={IUsuarios} value="342%" sub="Retorno" />
    </div>
    <div className="two-col">
      <div className="card"><div className="card-header"><h3>Vendas por Dia</h3></div><div className="chart-placeholder">📊 Gráfico de Barras</div></div>
      <div className="card"><div className="card-header"><h3>Categorias</h3></div><div className="chart-placeholder">📊 Gráfico de Pizza</div></div>
    </div>
    <div className="card">
      <div className="card-header"><h3>Top 10 Produtos (Novembro)</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>#</th><th>Produto</th><th>Unidades</th><th>Receita</th><th>Margem</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Losartana 50mg</td><td>127</td><td>R$ 2.331,72</td><td>32%</td></tr>
          <tr><td>2</td><td>Sinvastatina 20mg</td><td>98</td><td>R$ 2.038,40</td><td>28%</td></tr>
        </tbody>
      </table></div>
    </div>
  </>;
}

const SECOES = { visaoGeral: VisaoGeral, dispensacao: Dispensacao, estoque: Estoque, vendas: Vendas, relatorios: Relatorios };

export function PainelFarmacia({ secao, acoes, dados, usuario }) {
  const SecaoAtual = SECOES[secao] || VisaoGeral;
  return <SecaoAtual acoes={acoes} dados={dados} usuario={usuario} />;
}
