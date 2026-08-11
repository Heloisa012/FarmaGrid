require('dotenv').config();

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

//Janela Principal
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: './src/public/img/LogoFarmaGrid.png',
    resizable: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  //Menu Personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile('./src/views/index.html');
};

//Janela Secundária
const childWindow = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const child = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/LogoFarmaGrid.png',
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    child.loadFile('./src/views/indexMedico.html');
  }
};

//terceira Janela
const childWindow2 = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const child = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/LogoFarmaGrid.png',
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    child.loadFile('./src/views/indexFarmacia.html');
  }
};

//quarta Janela
const childWindow3 = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const child = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/LogoFarmaGrid.png',
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    child.loadFile('./src/views/indexBalconista.html');
  }
};

//quinta Janela
const childWindow4 = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const child = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/LogoFarmaGrid.png',
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    child.loadFile('./src/views/indexCaixa.html');
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//Template Menu
const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Janela Secundária',
        click: () => childWindow(),
      },
      {
        label: 'Janela terciaria',
        click: () => childWindow2(),
      },
      {
        label: 'Janela quarta',
        click: () => childWindow3(),
      },
      {
        label: 'Janela quinta',
        click: () => childWindow4(),
      },
      {
        label: 'Sair',
        click: () => app.quit(),
        accelerator: 'Alt+F4',
      },
    ],
  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload',
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: 'toggleDevTools',
      },
      {
        type: 'separator',
      },
      {
        label: 'Aplicar zoom',
        role: 'zoomIn',
      },
      {
        label: 'Reduzir',
        role: 'zoomOut',
      },
      {
        label: 'Restaurar zoom',
        role: 'resetZoom',
      },
    ],
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Documentação',
        click: () => shell.openExternal('https://www.electronjs.org/pt/docs/latest/'),
      },
      {
        type: 'separator',
      },
      {
        label: 'Sobre',
        click: () => aboutWindow(),
      },
    ],
  },
];

//abrir indexMedico
ipcMain.on('abrir-janela-index', () => {
  console.log('main: recebeu abrir-janela-index');
  const janelaAtual = BrowserWindow.getFocusedWindow();
  if (janelaAtual) {
    console.log('main: carregando indexMedico.html na janela atual');
    janelaAtual.loadFile(path.join(__dirname, 'src/views/indexMedico.html'));
  }
});

//abrir Teleconsulta
ipcMain.on('abrir-janela-t', () => {
  console.log('main: recebeu abrir-janela-t');
  const janelaAtual2 = BrowserWindow.getFocusedWindow();
  if (janelaAtual2) {
    console.log('main: carregando teleconsulta.html na janela atual');
    janelaAtual2.loadFile(path.join(__dirname, 'src/views/teleconsulta.html'));
  }
});

//abrir assistente IA
ipcMain.on('abrir-janela-ia', () => {
  console.log('main: recebeu abrir-janela-ia');
  const janelaAtual3 = BrowserWindow.getFocusedWindow();
  if (janelaAtual3) {
    console.log('main: carregando assistenteIA.html na janela atual');
    janelaAtual3.loadFile(path.join(__dirname, 'src/views/assistenteIA.html'));
  }
});

//abrir parcerias
ipcMain.on('abrir-janela-parceria', () => {
  console.log('main: recebeu abrir-janela-parceria');
  const janelaAtual4 = BrowserWindow.getFocusedWindow();
  if (janelaAtual4) {
    console.log('main: carregando parcerias.html na janela atual');
    janelaAtual4.loadFile(path.join(__dirname, 'src/views/parcerias.html'));
  }
});

//abrir DashBoard
ipcMain.on('abrir-janela-d', () => {
  console.log('main: recebeu abrir-janela-d');
  const janelaAtual5 = BrowserWindow.getFocusedWindow();
  if (janelaAtual5) {
    console.log('main: carregando indexFarmacia.html na janela atual');
    janelaAtual5.loadFile(path.join(__dirname, 'src/views/indexFarmacia.html'));
  }
});

//abrir Estoque
ipcMain.on('abrir-janela-e', () => {
  console.log('main: recebeu abrir-janela-e');
  const janelaAtual6 = BrowserWindow.getFocusedWindow();
  if (janelaAtual6) {
    console.log('main: carregando estoque.html na janela atual');
    janelaAtual6.loadFile(path.join(__dirname, 'src/views/estoque.html'));
  }
});

//abrir Validade
ipcMain.on('abrir-janela-v', () => {
  console.log('main: recebeu abrir-janela-v');
  const janelaAtual7 = BrowserWindow.getFocusedWindow();
  if (janelaAtual7) {
    console.log('main: carregando validade.html na janela atual');
    janelaAtual7.loadFile(path.join(__dirname, 'src/views/validade.html'));
  }
});

//abrir Desconto
ipcMain.on('abrir-janela-de', () => {
  console.log('main: recebeu abrir-janela-de');
  const janelaAtual8 = BrowserWindow.getFocusedWindow();
  if (janelaAtual8) {
    console.log('main: carregando descontos.html na janela atual');
    janelaAtual8.loadFile(path.join(__dirname, 'src/views/descontos.html'));
  }
});

//abrir relatorios
ipcMain.on('abrir-janela-r', () => {
  console.log('main: recebeu abrir-janela-r');
  const janelaAtual9 = BrowserWindow.getFocusedWindow();
  if (janelaAtual9) {
    console.log('main: carregando relatorio.html na janela atual');
    janelaAtual9.loadFile(path.join(__dirname, 'src/views/relatorio.html'));
  }
});

//abrir indexLogin
ipcMain.on('abrir-janela-l', () => {
  console.log('main: recebeu abrir-janela-l');
  const janelaAtual0 = BrowserWindow.getFocusedWindow();
  if (janelaAtual0) {
    console.log('main: carregando index.html na janela atual');
    janelaAtual0.loadFile(path.join(__dirname, 'src/views/index.html'));
  }
});

//abrir Sensor
ipcMain.on('abrir-janela-se', () => {
  console.log('main: recebeu abrir-janela-se');
  const janelaAtual11 = BrowserWindow.getFocusedWindow();
  if (janelaAtual11) {
    console.log('main: carregando sensor.html na janela atual');
    janelaAtual11.loadFile(path.join(__dirname, 'src/views/sensor.html'));
  }
});

//abrir balconista
ipcMain.on('abrir-janela-balconista', () => {
  console.log('main: recebeu abrir-janela-balconista');
  const janelaAtual12 = BrowserWindow.getFocusedWindow();
  if (janelaAtual12) {
    console.log('main: carregando indexBalconista.html na janela atual');
    janelaAtual12.loadFile(path.join(__dirname, 'src/views/indexBalconista.html'));
  }
});

//abrir balconista
ipcMain.on('abrir-janela-caixa', () => {
  console.log('main: recebeu abrir-janela-caixa');
  const janelaAtual13 = BrowserWindow.getFocusedWindow();
  if (janelaAtual13) {
    console.log('main: carregando indexCaixa.html na janela atual');
    janelaAtual13.loadFile(path.join(__dirname, 'src/views/indexCaixa.html'));
  }
});

//abrir funcionario
ipcMain.on('abrir-janela-func', () => {
  console.log('main: recebeu abrir-janela-func');
  const janelaAtual14 = BrowserWindow.getFocusedWindow();
  if (janelaAtual14) {
    console.log('main: carregando funcionarios.html na janela atual');
    janelaAtual14.loadFile(path.join(__dirname, 'src/views/funcionarios.html'));
  }
});

//abrir configurações
ipcMain.on('abrir-janela-config', () => {
  console.log('main: recebeu abrir-janela-config');
  const janelaAtual15 = BrowserWindow.getFocusedWindow();
  if (janelaAtual15) {
    console.log('main: carregando configuracoes.html na janela atual');
    janelaAtual15.loadFile(path.join(__dirname, 'src/views/configuracoes.html'));
  }
});


// === CONEXÃO COM A API ===
const api = require('./src/api/client');

// ── Mapeadores: JSON da API (camelCase) -> mesma forma que o front-end já espera ──
const mapProntuario = (p) => ({
  id: p.id,
  id_paciente: p.idPaciente,
  nome_paciente: p.nomePaciente,
  idade: p.idade,
  condicao: p.condicao,
  ultima_visita: p.ultimaVisita,
  status: p.status,
  tipo: p.tipo,
  notas: p.notas,
});

const mapReceita = (r) => ({
  id: r.id,
  id_medico: r.idMedico,
  id_paciente: r.idPaciente,
  medicamento: r.medicamento,
  dosagem: r.dosagem,
  duracao: r.duracao,
  status: r.status,
});

const mapTeleconsulta = (t) => ({
  id: t.id,
  data: t.data,
  horario: t.horario,
  status: t.status,
  duracao: t.duracao,
  tipo: t.tipo,
  nomePaciente: t.nomePaciente,
});

const mapFuncionario = (f) => ({
  CPF: f.cpf,
  nome: f.nome,
  email: f.email,
  telefone: f.telefone,
  funcao: f.funcao,
  status: f.status,
});

const mapCliente = (c) => c && ({
  CPF: c.cpf,
  nome: c.nome,
  telefone: c.telefone,
  email: c.email,
});

const mapProduto = (p) => ({
  id: p.id,
  nome: p.nome,
  categoria: p.categoria,
  quantidade: p.quantidade,
  estoque_min: p.estoqueMin,
  preco: p.preco,
  fornecedor: p.fornecedor,
  criado_em: p.criadoEm,
  tarja_preta: p.tarjaPreta,
  codigo_barras: p.codigoBarras,
  proxima_validade: p.proximaValidade,
  total_lotes: p.totalLotes,
});

const mapLote = (l) => ({
  id: l.id,
  id_produto: l.idProduto,
  numero_lote: l.numeroLote,
  quantidade: l.quantidade,
  data_validade: l.dataValidade,
  prateleira: l.prateleira,
});

const mapLoteComProduto = (l) => ({
  id: l.id,
  id_produto: l.idProduto,
  numero_lote: l.numeroLote,
  quantidade: l.quantidade,
  data_validade: l.dataValidade,
  prateleira: l.prateleira,
  nome_produto: l.nomeProduto,
});

const mapCupom = (c) => ({
  id: c.id,
  codigo: c.codigo,
  descricao: c.descricao,
  tipo: c.tipo,
  valor: c.valor,
  limite_uso: c.limiteUso,
  usos_atuais: c.usosAtuais,
  validade: c.validade,
  status: c.status,
});

const mapVenda = (v) => ({
  id: v.id,
  cliente: v.cliente,
  total: v.total,
  quantidade: v.quantidade,
  metodo_pago: v.metodoPago,
  troco: v.troco,
  data_venda: v.dataVenda,
  produtos: JSON.parse(v.produtos || '[]'),
});

const mapRelatorio = (r) => ({
  id: r.id,
  id_paciente: r.idPaciente,
  titulo: r.titulo,
  tipo: r.tipo,
  data: r.data,
});

const mapRelatorioFarmacia = (r) => ({
  id: r.id,
  tipo: r.tipo,
  periodo: r.periodo,
  formato: r.formato,
  nome_arquivo: r.nomeArquivo,
  caminho: r.caminho,
  tamanho_kb: r.tamanhoKb,
  gerado_em: r.geradoEm,
});

const mapMedicoConfig = (m) => ({
  id: m.id,
  nome: m.nome,
  sobrenome: m.sobrenome,
  crm: m.crm,
  especialidade: m.especialidade,
  email: m.email,
  telefone: m.telefone,
  data_nascimento: m.dataNascimento,
  endereco: m.endereco,
  foto_perfil: m.fotoPerfil,
  rqe: m.rqe,
  subespecialidades: m.subespecialidades,
  horario_inicio: m.horarioInicio,
  horario_termino: m.horarioTermino,
  nome_clinica: m.nomeClinica,
  endereco_clinica: m.enderecoClinica,
  tempo_consulta: m.tempoConsulta,
  valor_consulta: m.valorConsulta,
});

const hojeISO = () => new Date().toISOString().slice(0, 10);
const somarDiasISO = (dias) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

// === LOGIN ===
ipcMain.handle('login', async (event, email, senha, tipoSelecionado) => {
  try {
    const resposta = await api.apiPost('/auth/login', { email, senha, tipo: tipoSelecionado });
    api.setToken(resposta.token);
    return {
      id: resposta.id,
      email: resposta.email,
      tipo: resposta.tipo,
      id_medico: resposta.idMedico,
      id_farmacia: resposta.idFarmacia,
      id_balconista: resposta.idBalconista,
      id_caixa: resposta.idCaixa,
      perfil: resposta.perfil,
    };
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return null;
  }
});

// === BUSCAR PRONTUÁRIOS ===
ipcMain.handle('buscar-prontuarios', async () => {
  try {
    const rows = await api.apiGet('/api/prontuarios');
    return rows.map(mapProntuario);
  } catch (error) {
    console.error('Erro ao buscar prontuários:', error);
    throw error;
  }
});

// === BUSCAR RECEITAS ===
ipcMain.handle('buscar-receitas', async (event, idPaciente) => {
  try {
    const rows = await api.apiGet(`/api/receitas/paciente/${idPaciente}`);
    return rows.map(mapReceita);
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
});

// === CADASTRAR PARCEIRO ===
ipcMain.handle('cadastrar-parceiro', async (event, novoParceiro) => {
  try {
    const { parceiro, tipo, email, telefone, desconto, dataInicio } = novoParceiro;
    const result = await api.apiPost('/api/parceiros', { parceiro, tipo, email, telefone, desconto, dataInicio });
    console.log('Parceiro cadastrado com sucesso!');
    return result;
  } catch (err) {
    console.error('Erro ao cadastrar parceiro:', err);
    throw err;
  }
});

// === CONSULTAS DO MÉDICO LOGADO ===
ipcMain.handle('buscar-consultas-medico', async (event, idMedico) => {
  try {
    const rows = await api.apiGet(`/api/teleconsultas/medico/${idMedico}`);
    const consultas = rows.map(mapTeleconsulta);
    console.log('Consultas encontradas:', consultas);
    return consultas;
  } catch (error) {
    console.error('Erro ao buscar consultas do médico:', error);
    throw error;
  }
});

// === CADASTRAR FUNCIONÁRIO ===
ipcMain.handle('cadastrar-funcionario', async (event, novoFuncionario) => {
  try {
    const { cpf, nome, email, telefone, funcao, status } = novoFuncionario;
    const resultado = await api.apiPost('/api/funcionarios', { cpf, nome, email, telefone, funcao, status });
    console.log('Funcionário cadastrado com sucesso!');
    return { sucesso: true, resultado };
  } catch (err) {
    console.error('Erro ao cadastrar funcionário:', err);
    if (String(err.message).includes('CPF já cadastrado')) {
      return { sucesso: false, erro: 'CPF já cadastrado.' };
    }
    throw err;
  }
});

// === BUSCAR FUNCIONÁRIOS ===
ipcMain.handle('buscar-funcionarios', async () => {
  try {
    const rows = await api.apiGet('/api/funcionarios');
    return rows.map(mapFuncionario);
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err);
    throw err;
  }
});

// === ATUALIZAR STATUS DO FUNCIONÁRIO ===
ipcMain.handle('atualizar-status-funcionario', async (event, dados) => {
  try {
    const { cpf, status } = dados;
    await api.apiPatch(`/api/funcionarios/${cpf}/status`, { status });
    console.log(`Status do funcionário ${cpf} atualizado para ${status}`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    return { sucesso: false, erro: err.message };
  }
});

// ==== Salvar venda =====
ipcMain.handle('salvar-venda', async (_event, venda) => {
  let totalNum = venda.total;
  if (typeof totalNum === 'string') {
    totalNum = parseFloat(totalNum.replace('R$', '').replace(',', '.').trim());
  }

  await api.apiPost('/api/vendas', {
    id: venda.id,
    cliente: venda.cliente || 'Cliente não informado',
    total: totalNum,
    quantidade: venda.quantidade || (venda.produtos ? venda.produtos.length : 0),
    metodoPago: venda.metodoPago,
    troco: venda.troco || 0,
    dataVenda: venda.dataVenda,
    produtos: JSON.stringify(venda.produtos || []),
  });
  return { ok: true };
});

// ==== Buscar vendas por período =======

ipcMain.handle('buscar-vendas', async (_event, { dataInicio, dataFim }) => {
  const rows = await api.apiGet('/api/vendas');

  console.log('=== DEBUG BUSCAR VENDAS ===');
  console.log('Total de linhas no banco:', rows.length);
  console.log('dataInicio recebido:', dataInicio);
  console.log('dataFim recebido:', dataFim);
  if (rows.length > 0) {
    console.log('Exemplo data_venda do banco:', rows[0].dataVenda);
  }

  const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
  const fim    = dataFim    ? new Date(dataFim    + 'T23:59:59') : null;

  const filtradas = rows.filter(v => {
      const partes = (v.dataVenda || '').split('/');
      if (partes.length !== 3) return false;
      const dataV = new Date(`${partes[2]}-${partes[1]}-${partes[0]}T12:00:00`);
      if (inicio && dataV < inicio) return false;
      if (fim    && dataV > fim)    return false;
      return true;
    });

  console.log('Vendas após filtro:', filtradas.length);

  return filtradas.map(mapVenda);
});

// === CADASTRAR CLIENTE ===
ipcMain.handle('cadastrar-cliente', async (_event, cliente) => {
  try {
    const { cpf, nome, telefone, email } = cliente;
    await api.apiPost('/api/clientes', { cpf, nome, telefone: telefone || null, email: email || null });
    return { sucesso: true };
  } catch (err) {
    if (String(err.message).includes('CPF já cadastrado')) {
      return { sucesso: false, erro: 'CPF já cadastrado.' };
    }
    console.error('Erro ao cadastrar cliente:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR CLIENTE POR CPF ===
ipcMain.handle('buscar-cliente', async (_event, cpf) => {
  try {
    const cliente = await api.apiGet(`/api/clientes/${cpf}`);
    return mapCliente(cliente);
  } catch (err) {
    console.error('Erro ao buscar cliente:', err);
    return null;
  }
});

// === SALVAR TELECONSULTAS ===
ipcMain.handle("salvarConsulta", async (event, consulta) => {
  try {
    const resultado = await api.apiPost('/api/consultas', {
      pacienteId: consulta.paciente_id,
      data: consulta.data,
      horario: consulta.horario,
      tipo: consulta.tipo,
      duracao: consulta.duracao,
    });

    console.log("Consulta salva com sucesso! ID:", resultado.id);
    return { sucesso: true, id: resultado.id };

  } catch (err) {
    console.error("Erro ao salvar consulta:", err);
    return { sucesso: false, erro: err.message };
  }
});

// === REAGENDAR TELECONSULTA ===
ipcMain.handle("reagendarConsulta", async (event, dados) => {
  try {
    const { id, novaData, novoHorario, novaDuracao } = dados;

    await api.apiPatch(`/api/consultas/${id}/reagendar`, { novaData, novoHorario, novaDuracao });

    console.log(`Consulta ${id} reagendada com sucesso!`);
    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao reagendar consulta:", err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR PACIENTES PARA TELECONSULTA ===
ipcMain.handle('buscar-pacientes', async () => {
  try {
    return await api.apiGet('/api/farma-pacientes');
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    throw error;
  }
});

// === SELECIONAR PDF ===
ipcMain.handle('selecionar-pdf', async () => {
    try {
        const resultado = await dialog.showOpenDialog({
            filters: [{ name: 'PDF', extensions: ['pdf'] }],
            properties: ['openFile']
        });
        if (resultado.canceled) return null;
        return resultado.filePaths[0];
    } catch (err) {
        console.error('Erro no selecionar-pdf:', err);
        return null;
    }
});

// === ABRIR PDF DO BANCO ===
ipcMain.handle('abrir-pdf', async (event, idRelatorio) => {
    try {
        const buffer = await api.apiGetBuffer(`/api/relatorios/${idRelatorio}/arquivo`);

        const pasta = path.join(__dirname, 'src/relatorios');
        if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

        const tempPath = path.join(pasta, `temp_${idRelatorio}.pdf`);
        fs.writeFileSync(tempPath, buffer);
        await shell.openPath(tempPath);
    } catch (err) {
        console.error('Erro no abrir-pdf:', err);
    }
});

// === SALVAR RELATORIO NO BANCO ===
ipcMain.handle('salvar-relatorio', async (event, { pacienteId, nome, data, caminho }) => {
    try {
        const arquivoBuffer = fs.readFileSync(caminho);
        const resultado = await api.apiPostMultipart('/api/relatorios', {
            idPaciente: pacienteId,
            titulo: nome,
            data,
            arquivo: arquivoBuffer,
            nomeArquivo: path.basename(caminho),
        });
        return resultado.id;
    } catch (err) {
        console.error('Erro no salvar-relatorio:', err);
        throw err;
    }
});

// === BUSCAR RELATORIOS DO BANCO ===
ipcMain.handle('buscar-relatorios', async (event, pacienteId) => {
    try {
        const rows = await api.apiGet(`/api/relatorios/paciente/${pacienteId}`);
        return rows.map(mapRelatorio);
    } catch (err) {
        console.error('Erro no buscar-relatorios:', err);
        throw err;
    }
});

// === DELETAR RELATORIO ===
ipcMain.handle('deletar-relatorio', async (event, id) => {
    try {
        await api.apiDelete(`/api/relatorios/${id}`);
        return { sucesso: true };
    } catch (err) {
        console.error('Erro ao deletar relatório:', err);
        throw err;
    }
});

// === BUSCAR DADOS DO MÉDICO (CONFIGURAÇÕES) ===
ipcMain.handle('buscar-dados-medico', async (event, idMedico) => {
  try {
    const medico = await api.apiGet(`/api/medicos/${idMedico}/config`);
    return mapMedicoConfig(medico);
  } catch (err) {
    console.error('Erro ao buscar dados do médico:', err);
    throw err;
  }
});

// === SALVAR ALTERAÇÕES DE CONFIGURAÇÕES DO MEDICO ===
ipcMain.handle('atualizar-dados-medico', async (event, dados) => {
  try {
    await api.apiPut(`/api/medicos/${dados.id}`, {
      nome: dados.nome,
      sobrenome: dados.sobrenome,
      email: dados.email,
      telefone: dados.telefone,
      dataNascimento: dados.data_nascimento,
      endereco: dados.endereco,
    });
    return { sucesso: true };
  } catch (err) {
    console.error(err);
    return { sucesso: false };
  }
});

// === SALVAR ALTERAÇÕES PROFISSIONAIS DO MEDICO ===
ipcMain.handle('atualizar-dados-profissionais', async (event, dados) => {
  try {
    await api.apiPut(`/api/medicos/${dados.id}/profissional`, {
      crm: dados.crm,
      rqe: dados.rqe,
      especialidade: dados.especialidade,
      subespecialidades: dados.subespecialidades,
      nomeClinica: dados.nome_clinica,
      enderecoClinica: dados.endereco_clinica,
      tempoConsulta: dados.tempo_consulta,
      valorConsulta: dados.valor_consulta,
    });
    return { sucesso: true };
  } catch (err) {
    console.error(err);
    return { sucesso: false };
  }
});

// === SALVAR PREFERÊNCIAS DO MÉDICO ===
ipcMain.handle('atualizar-preferencias', async (event, dados) => {
  try {
    await api.apiPut(`/api/medicos/${dados.id}/preferencias`, {
      horarioInicio: dados.horario_inicio,
      horarioTermino: dados.horario_termino,
    });
    return { sucesso: true };
  } catch (err) {
    console.error(err);
    return { sucesso: false };
  }
});

// === SALVAR FOTO DE PERFIL NO BANCO ===
ipcMain.handle('salvar-foto-perfil', async (event, data) => {
    const base64 = Buffer.from(data.foto).toString('base64');
    await api.apiPut(`/api/medicos/${data.id}/foto`, { foto: base64 });
});

// === BUSCAR TODOS OS PRODUTOS ===
ipcMain.handle('buscar-produtos', async () => {
  try {
    const rows = await api.apiGet('/api/produtos');
    return rows.map(mapProduto);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    throw err;
  }
});

// === BUSCAR LOTES DE UM PRODUTO ===
ipcMain.handle('buscar-lotes', async (event, idProduto) => {
  try {
    const rows = await api.apiGet(`/api/lotes/produto/${idProduto}`);
    return rows.map(mapLote);
  } catch (err) {
    console.error('Erro ao buscar lotes:', err);
    throw err;
  }
});

// === CADASTRAR PRODUTO ===
ipcMain.handle('cadastrar-produto', async (event, dados) => {
  try {
    const { nome, categoria, quantidade, estoque_min, preco, fornecedor, codigo_barras, tarja_preta } = dados;
    const resultado = await api.apiPost('/api/produtos', {
      nome, categoria, quantidade, estoqueMin: estoque_min, preco, fornecedor,
      codigoBarras: codigo_barras || null, tarjaPreta: !!tarja_preta,
    });
    return { sucesso: true, id: resultado.id };
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    if (String(err.message).includes('Código de barras')) {
      return { sucesso: false, erro: 'Código de barras já cadastrado.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === EDITAR PRODUTO ===
ipcMain.handle('editar-produto', async (event, dados) => {
  try {
    const { id, nome, categoria, estoque_min, preco, fornecedor, codigo_barras, tarja_preta } = dados;
    await api.apiPut(`/api/produtos/${id}`, {
      nome, categoria, estoqueMin: estoque_min, preco, fornecedor,
      codigoBarras: codigo_barras || null, tarjaPreta: !!tarja_preta,
    });
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    if (String(err.message).includes('Código de barras')) {
      return { sucesso: false, erro: 'Código de barras já cadastrado.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === ATUALIZAR ESTOQUE (ENTRADA/SAÍDA + LOTE) ===
ipcMain.handle('atualizar-estoque', async (event, dados) => {
  try {
    const { id_produto, tipo, quantidade, numero_lote, data_validade, prateleira } = dados;
    await api.apiPost('/api/lotes', {
      idProduto: id_produto,
      tipo,
      quantidade,
      numeroLote: numero_lote || null,
      dataValidade: data_validade || null,
      prateleira: prateleira || null,
    });
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar estoque:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === DELETAR PRODUTO ===
ipcMain.handle('deletar-produto', async (event, id) => {
  try {
    await api.apiDelete(`/api/produtos/${id}`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR LOTES COM VALIDADE PRÓXIMA (a partir de hoje) ===
ipcMain.handle('buscar-alertas-validade', async () => {
  try {
    const hoje = hojeISO();
    const rows = await api.apiGet('/api/lotes');
    return rows
      .filter(l => l.dataValidade && l.dataValidade >= hoje)
      .map(mapLoteComProduto);
  } catch (err) {
    console.error('Erro ao buscar alertas de validade:', err);
    throw err;
  }
});

// === REMOVER LOTE (MARCAR COMO RESOLVIDO) ===
ipcMain.handle('remover-lote', async (event, id) => {
  try {
    await api.apiDelete(`/api/lotes/${id}`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao remover lote:', err);
    return { sucesso: false };
  }
});

// === BUSCAR CUPONS ===
ipcMain.handle('buscar-cupons', async () => {
  try {
    const rows = await api.apiGet('/api/cupons');
    return rows.map(mapCupom);
  } catch (err) {
    console.error('Erro ao buscar cupons:', err);
    throw err;
  }
});

// === CADASTRAR CUPOM ===
ipcMain.handle('cadastrar-cupom', async (event, dados) => {
  try {
    const { codigo, descricao, tipo, valor, limite_uso, validade } = dados;
    await api.apiPost('/api/cupons', { codigo, descricao, tipo, valor, limiteUso: limite_uso, validade: validade || null });
    return { sucesso: true };
  } catch (err) {
    if (String(err.message).includes('Código já existe')) return { sucesso: false, erro: 'Código já existe.' };
    return { sucesso: false, erro: err.message };
  }
});

// === EDITAR CUPOM ===
ipcMain.handle('editar-cupom', async (event, dados) => {
  try {
    const { id, descricao, tipo, valor, limite_uso, validade, status } = dados;
    await api.apiPut(`/api/cupons/${id}`, { descricao, tipo, valor, limiteUso: limite_uso, validade: validade || null, status });
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

// === DELETAR CUPOM ===
ipcMain.handle('deletar-cupom', async (event, id) => {
  try {
    await api.apiDelete(`/api/cupons/${id}`);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

// === DADOS DO DASHBOARD ===
ipcMain.handle('buscar-dashboard', async () => {
  try {
    const [produtos, lotes, estoqueBaixo, vendasRows] = await Promise.all([
      api.apiGet('/api/produtos'),
      api.apiGet('/api/lotes'),
      api.apiGet('/api/produtos/estoque-baixo'),
      api.apiGet('/api/vendas'),
    ]);

    const totalEstoque = produtos.reduce((soma, p) => soma + (p.quantidade || 0), 0);

    const hoje = hojeISO();
    const limite = somarDiasISO(30);
    const alertasRows = lotes
      .filter(l => l.dataValidade && l.dataValidade >= hoje && l.dataValidade <= limite)
      .map(mapLoteComProduto);

    const hojeDate = new Date();
    const mesAtual = hojeDate.getMonth();
    const anoAtual = hojeDate.getFullYear();

    const vendasDoMes = vendasRows
      .filter(v => {
        const partes = (v.dataVenda || '').split('/');
        if (partes.length !== 3) return false;
        return (parseInt(partes[1]) - 1) === mesAtual && parseInt(partes[2]) === anoAtual;
      })
      .reduce((soma, v) => soma + parseFloat(v.total), 0);

    return {
      totalEstoque,
      totalAlertasValidade: alertasRows.length,
      vendasDoMes,
      proximosVencimento: alertasRows.slice(0, 3),
      estoqueBaixo: estoqueBaixo.slice(0, 5).map(mapProduto),
    };
  } catch (err) {
    console.error('Erro ao buscar dados do dashboard:', err);
    throw err;
  }
});

// === RELATÓRIOS DA FARMÁCIA ===
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

function calcularPeriodoRelatorio(tipo, periodo) {
  const hoje = new Date();
  const dias = periodo === 'Última Semana' ? 7
             : periodo === 'Último Mês' ? 30
             : periodo === 'Últimos 3 Meses' ? 90
             : null;

  if (!dias) return { inicio: null, fim: null };

  // Validade olha pra FRENTE (próximos X dias), Vendas olha pra TRÁS (últimos X dias)
  if (tipo === 'validade') {
    const fim = new Date(hoje);
    fim.setDate(fim.getDate() + dias);
    return { inicio: hoje, fim };
  } else {
    const inicio = new Date(hoje);
    inicio.setDate(inicio.getDate() - dias);
    return { inicio, fim: hoje };
  }
}

async function buscarDadosRelatorio(tipo, periodo) {
  if (tipo === 'estoque') {
    const produtos = await api.apiGet('/api/produtos');
    return produtos
      .slice()
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map(p => ({
        nome: p.nome, categoria: p.categoria, quantidade: p.quantidade,
        estoque_min: p.estoqueMin, preco: p.preco, fornecedor: p.fornecedor,
      }));
  }

  if (tipo === 'validade') {
    const { inicio, fim } = calcularPeriodoRelatorio('validade', periodo);
    const lotes = await api.apiGet('/api/lotes');
    let filtrados = lotes.filter(l => l.dataValidade);
    if (inicio && fim) {
      const inicioISO = inicio.toISOString().split('T')[0];
      const fimISO = fim.toISOString().split('T')[0];
      filtrados = filtrados.filter(l => l.dataValidade >= inicioISO && l.dataValidade <= fimISO);
    }
    return filtrados.map(l => ({
      nome: l.nomeProduto, numero_lote: l.numeroLote, quantidade: l.quantidade,
      data_validade: l.dataValidade, prateleira: l.prateleira,
    }));
  }

  if (tipo === 'vendas') {
    const rows = (await api.apiGet('/api/vendas')).map(v => ({
      cliente: v.cliente, total: v.total, quantidade: v.quantidade,
      metodo_pago: v.metodoPago, data_venda: v.dataVenda,
    }));
    const { inicio, fim } = calcularPeriodoRelatorio('vendas', periodo);
    if (!inicio) return rows;

    return rows.filter(v => {
      const partes = (v.data_venda || '').split('/');
      if (partes.length !== 3) return false;
      const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      return data >= inicio && data <= fim;
    });
  }

  return [];
}

function gerarCSV(rows, caminho) {
  if (rows.length === 0) {
    fs.writeFileSync(caminho, 'Nenhum dado encontrado para este período.', 'utf8');
    return;
  }
  const colunas = Object.keys(rows[0]);
  const linhas = [colunas.join(',')];
  rows.forEach(r => linhas.push(colunas.map(c => `"${r[c] ?? ''}"`).join(',')));
  fs.writeFileSync(caminho, linhas.join('\n'), 'utf8');
}

function gerarXLSX(rows, caminho) {
  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ aviso: 'Nenhum dado encontrado' }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
  XLSX.writeFile(wb, caminho);
}

function gerarPDF(rows, caminho, titulo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(caminho);
    doc.pipe(stream);

    doc.fontSize(16).text(titulo, { underline: true });
    doc.moveDown();

    if (rows.length === 0) {
      doc.fontSize(11).text('Nenhum dado encontrado para este período.');
    } else {
      const colunas = Object.keys(rows[0]);
      doc.fontSize(9);
      rows.forEach(r => {
        doc.text(colunas.map(c => `${c}: ${r[c] ?? '—'}`).join('  |  '));
        doc.moveDown(0.3);
      });
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

ipcMain.handle('gerar-relatorio-farmacia', async (event, { tipo, periodo, formato }) => {
  try {
    const rows = await buscarDadosRelatorio(tipo, periodo);

    const pasta = app.getPath('downloads');

    const titulos = { estoque: 'Relatório de Estoque', validade: 'Relatório de Validade', vendas: 'Relatório de Vendas' };
    const extensao = formato === 'PDF' ? 'pdf' : formato === 'XLSX' ? 'xlsx' : 'csv';
    const nomeArquivo = `${tipo}_${Date.now()}.${extensao}`;
    const caminho = path.join(pasta, nomeArquivo);

    if (formato === 'CSV') gerarCSV(rows, caminho);
    else if (formato === 'XLSX') gerarXLSX(rows, caminho);
    else if (formato === 'PDF') await gerarPDF(rows, caminho, titulos[tipo]);

    const tamanhoKb = Math.round(fs.statSync(caminho).size / 1024);

    await api.apiPost('/api/relatorios-farmacia', {
      tipo, periodo, formato, nomeArquivo, caminho, tamanhoKb,
    });

    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    return { sucesso: false, erro: err.message };
  }
});

ipcMain.handle('buscar-relatorios-farmacia', async () => {
  try {
    const rows = await api.apiGet('/api/relatorios-farmacia');
    return rows.map(mapRelatorioFarmacia);
  } catch (err) {
    console.error('Erro ao buscar relatórios:', err);
    throw err;
  }
});

ipcMain.handle('baixar-relatorio-farmacia', async (event, id) => {
  try {
    const relatorio = await api.apiGet(`/api/relatorios-farmacia/${id}`);
    if (!relatorio) return { sucesso: false };
    await shell.openPath(relatorio.caminho);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao abrir relatório:', err);
    return { sucesso: false };
  }
});

ipcMain.handle('buscar-resumo-relatorios', async () => {
  try {
    const [produtos, lotes, vendasRows] = await Promise.all([
      api.apiGet('/api/produtos'),
      api.apiGet('/api/lotes'),
      api.apiGet('/api/vendas'),
    ]);

    const totalEstoque = produtos.reduce((soma, p) => soma + (p.quantidade || 0), 0);

    const hoje = hojeISO();
    const limite = somarDiasISO(30);
    const totalAlertas = lotes.filter(l => l.dataValidade && l.dataValidade >= hoje && l.dataValidade <= limite).length;

    const somarMes = (mes, ano) => vendasRows
      .filter(v => {
        const partes = (v.dataVenda || '').split('/');
        if (partes.length !== 3) return false;
        return (parseInt(partes[1]) - 1) === mes && parseInt(partes[2]) === ano;
      })
      .reduce((soma, v) => soma + parseFloat(v.total), 0);

    const hojeDate = new Date();
    const mesAtual = hojeDate.getMonth();
    const anoAtual = hojeDate.getFullYear();
    const mesAnterior = new Date(anoAtual, mesAtual - 1, 1);

    const vendasMesAtual = somarMes(mesAtual, anoAtual);
    const vendasMesAnterior = somarMes(mesAnterior.getMonth(), mesAnterior.getFullYear());

    const variacaoVendas = vendasMesAnterior > 0
      ? Math.round(((vendasMesAtual - vendasMesAnterior) / vendasMesAnterior) * 100)
      : null;

    return {
      totalEstoque,
      vendasMesAtual,
      variacaoVendas,
      totalAlertas,
    };
  } catch (err) {
    console.error('Erro ao buscar resumo de relatórios:', err);
    throw err;
  }
});

// === CHATBOT API ===
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

ipcMain.handle('enviar-prompt', async (event, prompt) => {
  try {
    const promptSeguro = "Atue como assistente acadêmico de farmacologia (não forneça dosagens): " + prompt;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: promptSeguro,
    });

    return response.text;

  } catch (error) {
    console.error("Status:", error.status);
    console.error("Mensagem:", error.message);
    console.error("Detalhes:", JSON.stringify(error, null, 2));
    return "Erro na análise: " + error.message;
  }
});
