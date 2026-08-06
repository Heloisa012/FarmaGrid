import { useState } from 'react';
import '../styles/barraLateral.css';
import { Logo } from './Logo.jsx';
import { ISair, IGrid, ICalendario, IArquivo, ICarrinho, IEstrela, IUsuarios, IEstoque, IGrafico } from './Icones.jsx';

const MENUS = {
  paciente: [
    ['visaoGeral',  IGrid,       'Visão Geral'],
    ['consultas',   ICalendario, 'Consultas'],
    ['exames',      IArquivo,    'Exames e Receitas'],
    ['loja',        ICarrinho,   'Loja'],
    ['clube',       IEstrela,    'Clube de Descontos'],
  ],
  profissional: [
    ['visaoGeral',  IGrid,       'Visão Geral'],
    ['parcerias',   IUsuarios,   'Parcerias'],
    ['prontuarios', IArquivo,    'Prontuários'],
    ['estoque',     IEstoque,    'Estoque'],
    ['relatorios',  IGrafico,    'Relatórios'],
  ],
  farmacia: [
    ['visaoGeral',  IGrid,       'Visão Geral'],
    ['dispensacao', IArquivo,    'Dispensação'],
    ['estoque',     IEstoque,    'Estoque'],
    ['vendas',      ICarrinho,   'Vendas'],
    ['relatorios',  IGrafico,    'Relatórios'],
  ],
};

const INFO_USUARIO = {
  paciente:     { iniciais: 'MS', nome: 'Maria Silva',      funcao: 'Paciente' },
  profissional: { iniciais: 'JS', nome: 'Dr. João Santos',  funcao: 'Cardiologista' },
  farmacia:     { iniciais: 'FP', nome: 'Farmácia Popular', funcao: 'Administrador' },
};

export function BarraLateral({ perfil, secao, setSecao, onLogout, onEditarPerfil, usuario }) {
  const [aberta, setAberta] = useState(false);
  const info = { ...INFO_USUARIO[perfil] ?? INFO_USUARIO.paciente, ...usuario };

  const fechar = () => setAberta(false);
  const navegar = (id) => { setSecao(id); fechar(); };

  return (
    <>
      {/* Barra superior mobile com hambúrguer */}
      <div className="mobile-topbar">
        <Logo size="sm" />
        <button
          type="button"
          className="sidebar-toggle"
          aria-label="Abrir menu"
          onClick={() => setAberta(a => !a)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Fundo escuro */}
      <div
        className={`sidebar-backdrop ${aberta ? 'open' : ''}`}
        onClick={fechar}
      />

      {/* Barra lateral */}
      <aside className={`sidebar ${aberta ? 'open' : ''}`}>
        <Logo size="sm" />

        <div className="user-card">
          <div className="user-avi">
            {info.avatar ? <img src={info.avatar} alt={info.nome} /> : info.iniciais}
          </div>
          <div>
            <div className="user-name">{info.nome}</div>
            <div className="user-role">{info.funcao}</div>
          </div>
        </div>

        <ul className="sidebar-nav">
          {MENUS[perfil].map(([id, Ico, rotulo]) => (
            <li
              key={id}
              className={`nav-item ${secao === id ? 'active' : ''}`}
              onClick={() => navegar(id)}
            >
              <Ico />{rotulo}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="nav-item" onClick={() => { fechar(); onEditarPerfil(); }}>
            <IUsuarios />Perfil
          </div>
          <div className="nav-item" onClick={() => { fechar(); onLogout(); }}>
            <ISair />Sair
          </div>
        </div>
      </aside>
    </>
  );
}
