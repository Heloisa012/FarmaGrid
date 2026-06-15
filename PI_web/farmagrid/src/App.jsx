import { useState, useCallback } from 'react';
import './styles/global.css';

import { Inicio }             from './pages/Inicio.jsx';
import { Login }              from './pages/Login.jsx';
import { EditarPerfil }       from './pages/EditarPerfil.jsx';
import { BarraLateral }       from './components/BarraLateral.jsx';
import { Toast }              from './components/UI.jsx';
import { ModaisDeAcao }       from './components/ModaisDeAcao.jsx';
import { PainelPaciente }     from './dashboards/PainelPaciente.jsx';
import { PainelProfissional } from './dashboards/PainelProfissional.jsx';
import { PainelFarmacia }     from './dashboards/PainelFarmacia.jsx';
import { TELECONSULTA_MEET_URL } from './data/dadosMock.js';
import { logout as authLogout, atualizarPerfil } from './services/authService.js';
import { useDadosPainel } from './hooks/useDadosPainel.js';
import { farmagridApi } from './services/farmagridApi.js';

const LOCAL_PROFILE_PREFIX = 'farmagrid_profile_';

function carregarPerfilLocal(email) {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(`${LOCAL_PROFILE_PREFIX}${email}`);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function salvarPerfilLocal(email, perfil) {
  if (!email) return;
  try {
    localStorage.setItem(`${LOCAL_PROFILE_PREFIX}${email}`, JSON.stringify(perfil));
  } catch (error) {
    // ignora falha de storage
  }
}

const PAINEIS = {
  paciente:     PainelPaciente,
  profissional: PainelProfissional,
  farmacia:     PainelFarmacia,
};

function perfilInicial(usuario, tipo) {
  const funcoes = {
    paciente: 'Paciente',
    profissional: usuario?.tipo === 'MEDICO' ? (usuario?.especialidade || 'Médico') : 'Profissional',
    farmacia: 'Farmácia',
  };
  return {
    nome: usuario?.nome || 'Usuário',
    funcao: funcoes[tipo] || 'Usuário',
    cargo: funcoes[tipo] || 'Usuário',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    empresa: 'FarmaGrid',
    bio: '',
    avatar: usuario?.avatar || '',
  };
}

export default function App() {
  const [pagina,       setPagina]       = useState('inicio');
  const [tipoPerfil,   setTipoPerfil]   = useState(null);
  const [secao,        setSecao]        = useState('visaoGeral');
  const [modal,        setModal]        = useState(null);
  const [toast,        setToast]        = useState('');
  const [carrinho,     setCarrinho]     = useState([]);
  const [usuario,      setUsuario]      = useState(null);
  const [dadosUsuario, setDadosUsuario] = useState(null);

  const { dados: dadosPainel, carregando: carregandoPainel, erro: erroPainel, recarregar: recarregarPainel } = useDadosPainel(usuario, tipoPerfil);

  const exibirToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const fecharModal = () => setModal(null);

  const confirmarModal = (msg) => {
    if (msg) exibirToast(msg);
    fecharModal();
  };

  const adicionarAoCarrinho = (nome, preco, precoOriginal) => {
    setCarrinho(prev => {
      const existente = prev.find(i => i.nome === nome);
      if (existente) return prev.map(i => i.nome === nome ? { ...i, qtd: i.qtd + 1 } : i);
      return [...prev, { nome, preco, precoOriginal, qtd: 1 }];
    });
    exibirToast(`${nome} adicionado ao carrinho`);
  };

  const atualizarQtdCarrinho = (indice, delta) => {
    setCarrinho(prev => {
      const proximo = [...prev];
      if (delta < 0 && proximo[indice].qtd <= 1) {
        proximo.splice(indice, 1);
        return proximo;
      }
      proximo[indice] = { ...proximo[indice], qtd: proximo[indice].qtd + delta };
      return proximo;
    });
  };

  const removerDoCarrinho = (indice) => setCarrinho(prev => prev.filter((_, i) => i !== indice));
  const limparCarrinho = () => setCarrinho([]);

  const finalizarCompra = async () => {
    if (!carrinho.length) return exibirToast('Seu carrinho está vazio.');
    try {
      const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
      await farmagridApi.criarVenda({
        data: new Date().toISOString().slice(0, 19),
        tipoPagamento: 'PIX',
        valorPago: total,
        paciente: usuario?.idPaciente ? { id: usuario.idPaciente } : null,
      });
      exibirToast('Compra finalizada com sucesso!');
      limparCarrinho();
      recarregarPainel();
      fecharModal();
    } catch (e) {
      exibirToast(e.message || 'Erro ao finalizar compra.');
    }
  };

  const acoes = {
    setSecao,
    usuario,
    abrirModal: (tipo, dados) => setModal({ tipo, dados }),
    agendar: () => setModal({ tipo: 'agendar' }),
    teleconsulta: () => window.open(TELECONSULTA_MEET_URL, '_blank', 'noopener,noreferrer'),
    detalhes: (dados) => setModal({ tipo: 'detalhes', dados }),
    prontuario: () => setModal({ tipo: 'prontuario' }),
    novaReceita: (paciente) => setModal({ tipo: 'receita', dados: { paciente } }),
    novaConsulta: () => setModal({ tipo: 'novaConsulta' }),
    novaParceria: () => setModal({ tipo: 'novaParceria' }),
    adicionarProduto: () => setModal({ tipo: 'adicionarProduto' }),
    scannerQR: () => setModal({ tipo: 'scannerQR' }),
    verReceita: () => setModal({ tipo: 'verReceita' }),
    listaVencimento: () => setModal({ tipo: 'listaVencimento' }),
    adicionarProdutoEstoque: () => setModal({ tipo: 'adicionarProdutoEstoque' }),
    novaVenda: () => setModal({ tipo: 'novaVenda' }),
    abrirCarrinho: () => setModal({ tipo: 'carrinho' }),
    reagendar: () => { fecharModal(); setSecao('consultas'); setModal({ tipo: 'agendar' }); },
    confirmarConsulta: () => confirmarModal('Consulta confirmada com sucesso!'),
    baixarPdf: (nome) => exibirToast(`Download iniciado: ${nome}`),
    dispensar: () => confirmarModal('Medicamento dispensado com sucesso!'),
    solicitarReposicao: () => exibirToast('Solicitação de reposição enviada com sucesso.'),
    verificarSensor: () => exibirToast('Verificação iniciada. Equipe notificada.'),
    repor: () => exibirToast('Reposição registrada com sucesso.'),
    prepararConsulta: () => exibirToast('Consulta preparada com sucesso!'),
    exportarPdf: () => exibirToast('Exportação PDF iniciada.'),
    adicionarAoCarrinho,
    carrinho,
    atualizarQtdCarrinho,
    removerDoCarrinho,
    limparCarrinho,
    finalizarCompra,
    farmagridApi,
    recarregarPainel,
    exibirToast,
  };

  const handleLogin = (tipo, usuarioApi) => {
    const perfilLocal = carregarPerfilLocal(usuarioApi?.email);
    setTipoPerfil(tipo);
    setUsuario(usuarioApi);
    setDadosUsuario(perfilLocal || perfilInicial(usuarioApi, tipo));
    setSecao('visaoGeral');
    setPagina('painel');
  };

  const handleLogout = () => {
    authLogout();
    setTipoPerfil(null);
    setUsuario(null);
    setDadosUsuario(null);
    setCarrinho([]);
    setPagina('inicio');
  };

  const handleEditarPerfil = () => setPagina('perfil');

  const handleSalvarPerfil = async (novosDados) => {
    setDadosUsuario(prev => ({ ...prev, ...novosDados }));

    const payload = {
      nome: novosDados.nome,
      email: novosDados.email,
      telefone: novosDados.telefone,
      cargo: novosDados.cargo,
      empresa: novosDados.empresa,
      bio: novosDados.bio,
      avatar: novosDados.avatar,
    };

    try {
      const atualizado = await atualizarPerfil(payload);
      const novoPerfil = { ...dadosUsuario, ...novosDados, ...atualizado };
      setDadosUsuario(novoPerfil);
      salvarPerfilLocal(novosDados.email || dadosUsuario.email, novoPerfil);
      exibirToast('Perfil atualizado com sucesso!');
    } catch (err) {
      const novoPerfil = { ...dadosUsuario, ...novosDados };
      setDadosUsuario(novoPerfil);
      salvarPerfilLocal(novosDados.email || dadosUsuario.email, novoPerfil);
      exibirToast(err.message ? `Perfil atualizado localmente, mas falha no servidor: ${err.message}` : 'Perfil atualizado localmente, mas falha no servidor.');
    } finally {
      setPagina('painel');
    }
  };

  if (pagina === 'inicio') return <Inicio onLogin={() => setPagina('login')} />;
  if (pagina === 'login')  return <Login onBack={() => setPagina('inicio')} onLogin={handleLogin} />;
  if (pagina === 'perfil') return <EditarPerfil dados={dadosUsuario} onSalvar={handleSalvarPerfil} onCancelar={() => setPagina('painel')} />;

  if (!tipoPerfil || !PAINEIS[tipoPerfil]) {
    return <Login onBack={() => setPagina('inicio')} onLogin={handleLogin} />;
  }

  const Painel = PAINEIS[tipoPerfil];
  return (
    <div className="dashboard">
      <BarraLateral
        perfil={tipoPerfil}
        secao={secao}
        setSecao={setSecao}
        onLogout={handleLogout}
        onEditarPerfil={handleEditarPerfil}
        usuario={dadosUsuario}
      />
      <main className="main">
        {erroPainel && <div className="api-alert warn">{erroPainel} — exibindo dados locais.</div>}
        {carregandoPainel && <div className="api-alert info">Carregando dados da API...</div>}
        <Painel secao={secao} acoes={acoes} dados={dadosPainel} usuario={usuario} />
      </main>
      <ModaisDeAcao modal={modal} onFechar={fecharModal} onConfirmar={confirmarModal} acoes={acoes} dados={dadosPainel} />
      <Toast message={toast} />
    </div>
  );
}
