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


// === CONEXÃO COM O BANCO DE DADOS ===
const db = require('./src/db/conexao');

// === LOGIN ===
ipcMain.handle('login', async (event, email, senha, tipoSelecionado) => {
  try {
    const tabela = 'login';

    const [rows] = await db.promise().query(
      `SELECT * FROM ${tabela} WHERE email = ? AND senha = ? AND tipo = ? LIMIT 1`,
      [email, senha, tipoSelecionado]
    );

    if (rows.length > 0) {
      const user = rows[0];

      if (user.tipo === 1) {
        user.perfil = "medico";

      } else if (user.tipo === 2) {

        if (user.id_farmacia != null) {
          user.perfil = "farmacia";

        } else if (user.id_balconista != null) {
          user.perfil = "balconista";

        } else if (user.id_caixa != null) {
          user.perfil = "caixa";
        }
      }

      console.log('Usuário encontrado com perfil:', user);
      return user;

    } else {
      console.log('Nenhum usuário encontrado com essas credenciais.');
      return null;
    }

  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    throw err;
  }
});

// === BUSCAR PRONTUÁRIOS ===
ipcMain.handle('buscar-prontuarios', async () => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM prontuario');
    console.log('Prontuários buscados com sucesso:', rows);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar prontuários:', error);
    throw error;
  }
});

// === BUSCAR RECEITAS ===
ipcMain.handle('buscar-receitas', async (event, idPaciente) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM receita WHERE id_paciente = ?',
      [idPaciente]
    );
    console.log('Receitas buscadas com sucesso:', rows);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
});

// === CADASTRAR PARCEIRO ===
ipcMain.handle('cadastrar-parceiro', async (event, novoParceiro) => {
  try {
    const { parceiro, tipo, email, telefone, desconto, dataInicio } = novoParceiro;
    const sql = `
      INSERT INTO parceiros (parceiro, tipo, email, telefone, desconto, encaminhamentos, status, dataInicio)
      VALUES (?, ?, ?, ?, ?, DEFAULT, DEFAULT, ?)
    `;
    const [result] = await db.promise().query(sql, [
      parceiro, tipo, email, telefone, desconto, dataInicio,
    ]);
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
    const [rows] = await db.promise().query(`
      SELECT 
        t.id,
        t.data,
        t.horario,
        t.status,
        t.duracao,
        t.tipo,
        p.nomePaciente
      FROM teleconsulta t
      JOIN paciente p ON t.id_paciente = p.id
      WHERE t.id_medico = ?
      ORDER BY STR_TO_DATE(t.data, '%d/%m/%Y') ASC, t.horario ASC
    `, [idMedico]);

    console.log('Consultas encontradas:', rows);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar consultas do médico:', error);
    throw error;
  }
});

// === CADASTRAR FUNCIONÁRIO ===
ipcMain.handle('cadastrar-funcionario', async (event, novoFuncionario) => {
  try {
    const { cpf, nome, email, telefone, funcao, status } = novoFuncionario;

    // Salva o CPF como texto formatado: "123.456.789-00"
    const sql = `
      INSERT INTO funcFarma (CPF, nome, email, telefone, funcao, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [
      cpf, nome, email, telefone, funcao, status
    ]);

    console.log('Funcionário cadastrado com sucesso!');
    return { sucesso: true, resultado: result };

  } catch (err) {
    console.error('Erro ao cadastrar funcionário:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return { sucesso: false, erro: 'CPF já cadastrado.' };
    }
    throw err;
  }
});

// === BUSCAR FUNCIONÁRIOS ===
ipcMain.handle('buscar-funcionarios', async () => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM funcFarma');
    return rows;
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err);
    throw err;
  }
});

// === ATUALIZAR STATUS DO FUNCIONÁRIO ===
ipcMain.handle('atualizar-status-funcionario', async (event, dados) => {
  try {
    const { cpf, status } = dados;
    await db.promise().query(
      'UPDATE funcFarma SET status = ? WHERE CPF = ?',
      [status, cpf]
    );
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

  await db.promise().query(
    `INSERT INTO vendas_concluidas
       (id, cliente, total, quantidade, metodo_pago, troco, data_venda, produtos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       total = VALUES(total), metodo_pago = VALUES(metodo_pago)`,
    [
      venda.id,
      venda.cliente || 'Cliente não informado',
      totalNum,
      venda.quantidade || (venda.produtos ? venda.produtos.length : 0),
      venda.metodoPago,
      venda.troco || 0,
      venda.dataVenda,
      JSON.stringify(venda.produtos || [])
    ]
  );
  return { ok: true };
});

// ==== Buscar vendas por período =======

ipcMain.handle('buscar-vendas', async (_event, { dataInicio, dataFim }) => {
  const [rows] = await db.promise().query('SELECT * FROM vendas_concluidas');

  console.log('=== DEBUG BUSCAR VENDAS ===');
  console.log('Total de linhas no banco:', rows.length);
  console.log('dataInicio recebido:', dataInicio);
  console.log('dataFim recebido:', dataFim);
  if (rows.length > 0) {
    console.log('Exemplo data_venda do banco:', rows[0].data_venda);
  }

  const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
  const fim    = dataFim    ? new Date(dataFim    + 'T23:59:59') : null;

  const filtradas = rows.filter(v => {
      const partes = v.data_venda.split('/');
      if (partes.length !== 3) return false;
      const dataV = new Date(`${partes[2]}-${partes[1]}-${partes[0]}T12:00:00`);
      if (inicio && dataV < inicio) return false;
      if (fim    && dataV > fim)    return false;
      return true;
    });

  console.log('Vendas após filtro:', filtradas.length);

  return filtradas.map(v => ({
      ...v,
      produtos: JSON.parse(v.produtos || '[]')
    }));
});

// === CADASTRAR CLIENTE ===
ipcMain.handle('cadastrar-cliente', async (_event, cliente) => {
  try {
    const { cpf, nome, telefone, email } = cliente;
    await db.promise().query(
      `INSERT INTO clienteFarma (CPF, nome, telefone, email)
       VALUES (?, ?, ?, ?)`,
      [cpf, nome, telefone || null, email || null]
    );
    return { sucesso: true };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { sucesso: false, erro: 'CPF já cadastrado.' };
    }
    console.error('Erro ao cadastrar cliente:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR CLIENTE POR CPF ===
ipcMain.handle('buscar-cliente', async (_event, cpf) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM clienteFarma WHERE CPF = ? LIMIT 1',
      [cpf]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('Erro ao buscar cliente:', err);
    return null;
  }
});

// === SALVAR TELECONSULTAS ===
ipcMain.handle("salvarConsulta", async (event, consulta) => {
  try {
    const sql = `
      INSERT INTO consultas (paciente_id, data, horario, tipo, duracao)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(sql, [
      consulta.paciente_id,
      consulta.data,
      consulta.horario,
      consulta.tipo,
      consulta.duracao
    ]);

    console.log("Consulta salva com sucesso! ID:", result.insertId);
    return { sucesso: true, id: result.insertId };

  } catch (err) {
    console.error("Erro ao salvar consulta:", err);
    return { sucesso: false, erro: err.message };
  }
});

// === REAGENDAR TELECONSULTA ===
ipcMain.handle("reagendarConsulta", async (event, dados) => {
  try {
    const { id, novaData, novoHorario, novaDuracao } = dados;

    const sql = `
      UPDATE consultas
      SET data = ?, horario = ?, duracao = ?
      WHERE id = ?
    `;

    await db.promise().query(sql, [novaData, novoHorario, novaDuracao, id]);

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
    const [rows] = await db.promise().query('SELECT * FROM FarmaPacientes');
    return rows;
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
        const [rows] = await db.promise().query(
            `SELECT arquivo, titulo FROM relatorios WHERE id = ?`,
            [idRelatorio]
        );
        if (rows.length === 0) return;

        const pasta = path.join(__dirname, 'src/relatorios');
        if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

        const tempPath = path.join(pasta, `temp_${idRelatorio}.pdf`);
        fs.writeFileSync(tempPath, rows[0].arquivo);
        await shell.openPath(tempPath);
    } catch (err) {
        console.error('Erro no abrir-pdf:', err);
    }
});

// === SALVAR RELATORIO NO BANCO ===
ipcMain.handle('salvar-relatorio', async (event, { pacienteId, nome, data, caminho }) => {
    try {
        const arquivoBuffer = fs.readFileSync(caminho);
        const [result] = await db.promise().query(
            `INSERT INTO relatorios (id_paciente, titulo, data, arquivo) VALUES (?, ?, ?, ?)`,
            [pacienteId, nome, data, arquivoBuffer]
        );
        return result.insertId;
    } catch (err) {
        console.error('Erro no salvar-relatorio:', err);
        throw err;
    }
});

// === BUSCAR RELATORIOS DO BANCO ===
ipcMain.handle('buscar-relatorios', async (event, pacienteId) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT id, id_paciente, titulo, tipo, data FROM relatorios WHERE id_paciente = ?`,
            [pacienteId]
        );
        return rows;
    } catch (err) {
        console.error('Erro no buscar-relatorios:', err);
        throw err;
    }
});

// === DELETAR RELATORIO ===
ipcMain.handle('deletar-relatorio', async (event, id) => {
    try {
        await db.promise().query(`DELETE FROM relatorios WHERE id = ?`, [id]);
        return { sucesso: true };
    } catch (err) {
        console.error('Erro ao deletar relatório:', err);
        throw err;
    }
});

// === CHATBOT API - VERSÃO FINAL S.B.O ===
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: "AIzaSyCVeO4ny3ameXo0kPNqYR5qLW8fCa6mL-4" });

ipcMain.handle('enviar-prompt', async (event, prompt) => {
  try {
    const promptSeguro = "Atue como assistente acadêmico de farmacologia (não forneça dosagens): " + prompt;

    // ✅ Nova forma de chamar no SDK @google/genai
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