import { useState, useCallback } from 'react';
import './styles/global.css';

import { Inicio }             from './pages/Inicio.jsx';
import { Login }              from './pages/Login.jsx';
import { CadastroSucesso }    from './pages/CadastroSucesso.jsx';
import { EditarPerfil }       from './pages/EditarPerfil.jsx';
import { BarraLateral }       from './components/BarraLateral.jsx';
import { Toast }              from './components/UI.jsx';
import { ModaisDeAcao }       from './components/ModaisDeAcao.jsx';
import { PainelPaciente }     from './dashboards/PainelPaciente.jsx';
import { logout as authLogout, atualizarConfigPaciente, salvarFotoPaciente } from './services/authService.js';
import { useDadosPainel } from './hooks/useDadosPainel.js';
import { farmagridApi } from './services/farmagridApi.js';

const LOCAL_PROFILE_PREFIX = 'farmagrid_profile_';

function carregarPerfilLocal(email) {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(`${LOCAL_PROFILE_PREFIX}${email}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function salvarPerfilLocal(email, perfil) {
  if (!email) return;
  try {
    localStorage.setItem(`${LOCAL_PROFILE_PREFIX}${email}`, JSON.stringify(perfil));
  } catch {
    // ignora falha de storage
  }
}

function bytesParaDataUrl(bytes) {
  if (!bytes) return '';
  // O Jackson já manda um array de bytes como string base64 no JSON.
  return typeof bytes === 'string' ? `data:image/jpeg;base64,${bytes}` : '';
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
  const [infoCadastro, setInfoCadastro] = useState(null);

  const { dados: dadosPainel, carregando: carregandoPainel, erro: erroPainel, recarregar: recarregarPainel } = useDadosPainel(usuario);

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

  // ⚠️ GAP DE PRODUTO: POST /api/vendas agora exige idFarmacia (não-nulo) e
  // o Paciente não tem farmácia associada no schema atual — por isso o
  // checkout continua só local (sem chamar a API) até essa decisão ser
  // tomada. Ver farmagridApi.js.
  const finalizarCompra = () => {
    if (!carrinho.length) return exibirToast('Seu carrinho está vazio.');
    exibirToast('Compra finalizada com sucesso! (simulação local — ver nota sobre idFarmacia)');
    limparCarrinho();
    fecharModal();
  };

  const acoes = {
    setSecao,
    usuario,
    agendar: () => setModal({ tipo: 'agendar' }),
    // Cada teleconsulta pode ter seu próprio link de sala (linkSala) agora.
    // Se a consulta ainda não tiver um link salvo, avisamos em vez de abrir
    // uma URL genérica que não corresponde à consulta real.
    teleconsulta: (consulta) => {
      if (consulta?.linkSala) {
        window.open(consulta.linkSala, '_blank', 'noopener,noreferrer');
      } else {
        exibirToast('Esta consulta ainda não tem um link de sala definido.');
      }
    },
    detalhes: (dados) => setModal({ tipo: 'detalhes', dados }),
    reagendar: () => { fecharModal(); setSecao('consultas'); setModal({ tipo: 'agendar' }); },
    adicionarAoCarrinho,
    carrinho,
    atualizarQtdCarrinho,
    removerDoCarrinho,
    limparCarrinho,
    finalizarCompra,
    abrirCarrinho: () => setModal({ tipo: 'carrinho' }),
    farmagridApi,
    recarregarPainel,
    exibirToast,
  };

  const handleLogin = (tipo, usuarioApi) => {
    const perfilLocal = carregarPerfilLocal(usuarioApi?.email);
    setTipoPerfil(tipo);
    setUsuario(usuarioApi);
    setDadosUsuario(perfilLocal || {
      nome: usuarioApi?.nome || 'Usuário',
      cargo: tipo === 'paciente' ? 'Paciente' : 'Usuário',
      email: usuarioApi?.email || '',
      telefone: usuarioApi?.telefone || '',
      empresa: 'FarmaGrid',
      bio: '',
      avatar: bytesParaDataUrl(usuarioApi?.fotoPerfil),
    });
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

    try {
      if (!usuario?.idPaciente) throw new Error('Paciente não identificado.');

      // PUT /api/pacientes/{id}/config espera o objeto quase inteiro de volta
      // — mandamos o que já tínhamos (usuario.configRaw) mesclado com o que
      // o usuário editou nesta tela (nome/email/telefone).
      await atualizarConfigPaciente(usuario.idPaciente, {
        ...usuario.configRaw,
        nome: novosDados.nome,
        email: novosDados.email,
        telefone: novosDados.telefone,
      });

      // Foto: se o usuário trocou o avatar (data URL nova), sobe via o
      // endpoint dedicado de foto.
      if (novosDados.avatar && novosDados.avatar.startsWith('data:') && novosDados.avatar !== dadosUsuario?.avatar) {
        const base64 = novosDados.avatar.split(',')[1];
        if (base64) await salvarFotoPaciente(usuario.idPaciente, base64);
      }

      const novoPerfil = { ...dadosUsuario, ...novosDados };
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
  if (pagina === 'login') {
    return (
      <Login
        onBack={() => setPagina('inicio')}
        onLogin={handleLogin}
        onCadastroSucesso={(info) => { setInfoCadastro(info || null); setPagina('cadastroSucesso'); }}
      />
    );
  }
  if (pagina === 'cadastroSucesso') {
    return (
      <CadastroSucesso
        onVoltar={() => { setInfoCadastro(null); setPagina('inicio'); }}
        titulo={infoCadastro?.titulo}
        mensagem={infoCadastro?.mensagem}
        redirecionarEm={infoCadastro?.redirecionarEm}
      />
    );
  }
  if (pagina === 'perfil') return <EditarPerfil dados={dadosUsuario} onSalvar={handleSalvarPerfil} onCancelar={() => setPagina('painel')} />;

  if (!tipoPerfil) {
    return (
      <Login
        onBack={() => setPagina('inicio')}
        onLogin={handleLogin}
        onCadastroSucesso={(info) => { setInfoCadastro(info || null); setPagina('cadastroSucesso'); }}
      />
    );
  }

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
        <PainelPaciente secao={secao} acoes={acoes} dados={dadosPainel} usuario={usuario} />
      </main>
      <ModaisDeAcao modal={modal} onFechar={fecharModal} onConfirmar={confirmarModal} acoes={acoes} dados={dadosPainel} />
      <Toast message={toast} />
    </div>
  );
}
