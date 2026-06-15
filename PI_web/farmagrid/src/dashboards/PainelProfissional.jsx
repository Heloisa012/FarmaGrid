import { SBadge, StatCard } from '../components/UI.jsx';
import { ICalendario, IUsuarios, IArquivo, IDinheiro } from '../components/Icones.jsx';

function VisaoGeral({ acoes, dados, usuario }) {
  const consultas = dados?.consultas || [];
  return <>
    <div className="dashboard-header">
      <div><h2>Painel do Profissional</h2><p>Bem-vindo, {usuario?.nome || 'Dr.'}</p></div>
    </div>
    <div className="stats-row">
      <StatCard label="Consultas" IcoComp={ICalendario} value={String(consultas.length)} sub="Registradas na API" subCls="stat-positive" />
      <StatCard label="Pacientes Ativos" IcoComp={IUsuarios} value="247" sub="+12 este mês" subCls="stat-positive" />
      <StatCard label="Receitas Emitidas" IcoComp={IArquivo} value="35" sub="Esta semana" />
      <StatCard label="Receita Mensal" IcoComp={IDinheiro} value="R$ 48k" sub="+15% vs mês anterior" subCls="stat-positive" />
    </div>
    <div className="card">
      <div className="card-header">
        <h3>Agenda de Hoje</h3>
        <button type="button" className="btn btn-primary" onClick={acoes.novaConsulta}>Nova Consulta</button>
      </div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Horário</th><th>Paciente</th><th>Tipo</th><th>Motivo</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {(consultas.length ? consultas : [
            { data: '09:00', paciente: 'Maria Silva', tipo: 'Teleconsulta', status: 'Confirmada' },
          ]).map(c => (
            <tr key={c.id || c.data}>
              <td>{c.horario || c.data}</td><td>{c.paciente}</td><td>{c.tipo}</td><td>{c.especialidade || 'Consulta'}</td>
              <td><SBadge s={c.status} /></td>
              <td>
                {c.tipo === 'Teleconsulta'
                  ? <button type="button" className="btn btn-primary btn-sm" onClick={acoes.teleconsulta}>Iniciar</button>
                  : <button type="button" className="btn btn-secondary btn-sm" onClick={acoes.prontuario}>Ver Prontuário</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
    <div className="two-col">
      <div className="card">
        <div className="card-header"><h3>Alertas de Estoque</h3></div>
        <div className="alert-box warn"><strong>⚠️ Atenolol 50mg</strong><p>Estoque baixo: 15 unidades</p></div>
        <div className="alert-box danger"><strong>🔴 Losartana 50mg</strong><p>Estoque crítico: 5 unidades</p></div>
      </div>
      <div className="card">
        <div className="card-header"><h3>Notificações IoT</h3></div>
        <div className="alert-box info"><strong>📡 Sensor RFID - Setor A</strong><p>Temperatura: 22°C | Umidade: 55%</p></div>
        <div className="alert-box info"><strong>📡 Sensor RFID - Setor B</strong><p>Temperatura: 23°C | Umidade: 52%</p></div>
      </div>
    </div>
  </>;
}

function Parcerias({ acoes }) {
  return <>
    <div className="dashboard-header">
      <div><h2>Gestão de Parcerias</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.novaParceria}>Nova Parceria</button>
    </div>
    {[
      ['Clínicas Parceiras', ['Clínica Saúde Total', '12.345.678/0001-90', 'Av. Paulista, 1000 - SP', '127']],
      ['Farmácias Credenciadas', ['Farmácia Popular', '11.222.333/0001-44', 'Av. Brasil, 2000 - SP', '342']],
    ].map(([titulo, linha]) => (
      <div className="card" key={titulo}>
        <div className="card-header"><h3>{titulo}</h3></div>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Nome</th><th>CNPJ</th><th>Endereço</th><th>Atendimentos</th><th>Status</th></tr></thead>
          <tbody><tr>
            <td>{linha[0]}</td><td>{linha[1]}</td><td>{linha[2]}</td><td>{linha[3]}</td><td><SBadge s="Ativa" /></td>
          </tr></tbody>
        </table></div>
      </div>
    ))}
  </>;
}

function Prontuarios({ acoes }) {
  const pacientes = [
    ['Maria Silva', '58 anos', '05/11/2025', 'Hipertensão'],
    ['Pedro Costa', '42 anos', '03/11/2025', 'Diabetes Tipo 2'],
    ['Ana Oliveira', '35 anos', '01/11/2025', 'Check-up'],
  ];
  return <>
    <div className="dashboard-header">
      <div><h2>Prontuários Eletrônicos</h2></div>
      <div className="search-bar"><input type="text" placeholder="Buscar paciente..." /></div>
    </div>
    <div className="card">
      <div className="card-header"><h3>Pacientes Recentes</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Paciente</th><th>Idade</th><th>Última Consulta</th><th>Condição</th><th>Ações</th></tr></thead>
        <tbody>{pacientes.map(([n, i, d, c]) => (
          <tr key={n}>
            <td>{n}</td><td>{i}</td><td>{d}</td><td>{c}</td>
            <td style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={acoes.prontuario}>Ver Prontuário</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => acoes.novaReceita(n)}>Nova Receita</button>
            </td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  </>;
}

function Estoque({ acoes }) {
  return <>
    <div className="dashboard-header">
      <div><h2>Controle de Estoque com IoT/RFID</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.adicionarProduto}>Adicionar Produto</button>
    </div>
    <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard label="Total de Produtos" IcoComp={IArquivo} value="342" sub="Em estoque" />
      <StatCard label="Alertas Ativos" IcoComp={IUsuarios} value="7" sub="Requer atenção" subCls="stat-negative" />
      <StatCard label="Sensores RFID" IcoComp={ICalendario} value="12" sub="Todos ativos" subCls="stat-positive" />
    </div>
    <div className="card">
      <div className="card-header"><h3>Produtos em Estoque</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Produto</th><th>Tag RFID</th><th>Qtd</th><th>Mín</th><th>Validade</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Losartana 50mg</td><td>RFID-001234</td><td>5</td><td>20</td><td>15/06/2026</td><td><SBadge s="Crítico" /></td></tr>
          <tr><td>Sinvastatina 20mg</td><td>RFID-001235</td><td>45</td><td>30</td><td>20/08/2026</td><td><SBadge s="OK" /></td></tr>
          <tr><td>Atenolol 50mg</td><td>RFID-001236</td><td>15</td><td>25</td><td>10/07/2026</td><td><SBadge s="Baixo" /></td></tr>
        </tbody>
      </table></div>
    </div>
    <div className="card">
      <div className="card-header"><h3>Status dos Sensores IoT</h3></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['Setor A - 22°C', 'Setor B - 23°C', 'Setor C - 21°C'].map(s => (
          <div key={s} className="alert-box info"><strong>Sensor {s.split(' ')[1]}</strong><p>{s}</p><SBadge s="OK" /></div>
        ))}
      </div>
    </div>
  </>;
}

function Relatorios({ acoes }) {
  return <>
    <div className="dashboard-header">
      <div><h2>Relatórios Gerenciais</h2></div>
      <button type="button" className="btn btn-primary" onClick={acoes.exportarPdf}>Exportar PDF</button>
    </div>
    <div className="stats-row">
      <StatCard label="Receita Total (Nov)" IcoComp={IDinheiro} value="R$ 48.5k" sub="+15.2%" subCls="stat-positive" />
      <StatCard label="Despesas (Nov)" IcoComp={IArquivo} value="R$ 18.2k" sub="+5.1%" subCls="stat-negative" />
      <StatCard label="Lucro Líquido" IcoComp={IDinheiro} value="R$ 30.3k" sub="+22.7%" subCls="stat-positive" />
      <StatCard label="Consultas (Nov)" IcoComp={ICalendario} value="187" sub="+8.1%" subCls="stat-positive" />
    </div>
    <div className="two-col">
      <div className="card"><div className="card-header"><h3>Receitas vs Despesas</h3></div><div className="chart-placeholder">📊 Gráfico de Linha</div></div>
      <div className="card"><div className="card-header"><h3>Consultas por Dia</h3></div><div className="chart-placeholder">📊 Gráfico de Barras</div></div>
    </div>
    <div className="card">
      <div className="card-header"><h3>Top Medicamentos Prescritos</h3></div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>#</th><th>Medicamento</th><th>Prescrições</th><th>Pacientes</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Losartana 50mg</td><td>127</td><td>89</td></tr>
          <tr><td>2</td><td>Sinvastatina 20mg</td><td>98</td><td>72</td></tr>
        </tbody>
      </table></div>
    </div>
  </>;
}

const SECOES = { visaoGeral: VisaoGeral, parcerias: Parcerias, prontuarios: Prontuarios, estoque: Estoque, relatorios: Relatorios };

export function PainelProfissional({ secao, acoes, dados, usuario }) {
  const SecaoAtual = SECOES[secao] || VisaoGeral;
  return <SecaoAtual acoes={acoes} dados={dados} usuario={usuario} />;
}
