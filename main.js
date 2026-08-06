const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


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
      `SELECT * FROM ${tabela} WHERE email = ? AND tipo = ? LIMIT 1`,
      [email, tipoSelecionado]
    );

    if(rows.length === 0){
      return null;
    }

    const user = rows[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      user.senha
    );

    if(!senhaCorreta){
      return null;
    }

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

// === BUSCAR DADOS DO MÉDICO (CONFIGURAÇÕES) ===
ipcMain.handle('buscar-dados-medico', async (event, idMedico) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT m.*, mc.nome_clinica, mc.endereco_clinica, mc.tempo_consulta, mc.valor_consulta
      FROM medico m
      LEFT JOIN medico_clinica mc ON mc.id_medico = m.id
      WHERE m.id = ?
    `, [idMedico]);

    if (rows.length === 0) return null;

    const medico = rows[0];

    if (medico.foto_perfil) {
      medico.foto_perfil = medico.foto_perfil.toString('base64');
    }

    return medico;
  } catch (err) {
    console.error('Erro ao buscar dados do médico:', err);
    throw err;
  }
});

// === SALVAR ALTERAÇÕES DE CONFIGURAÇÕES DO MEDICO ===
ipcMain.handle('atualizar-dados-medico', async (event, dados) => {
  try {

    await db.promise().query(`
      UPDATE medico
      SET
        nome = ?,
        sobrenome = ?,
        email = ?,
        telefone = ?,
        data_nascimento = ?,
        endereco = ?
      WHERE id = ?
    `, [
      dados.nome,
      dados.sobrenome,
      dados.email,
      dados.telefone,
      dados.data_nascimento,
      dados.endereco,
      dados.id
    ]);

    return { sucesso: true };

  } catch (err) {
    console.error(err);
    return { sucesso: false };
  }
});

// === SALVAR ALTERAÇÕES PROFISSIONAIS DO MEDICO ===
ipcMain.handle('atualizar-dados-profissionais', async (event, dados) => {
  try {

    await db.promise().query(`
      UPDATE medico
      SET
        crm = ?,
        rqe = ?,
        especialidade = ?,
        subespecialidades = ?
      WHERE id = ?
    `, [
      dados.crm,
      dados.rqe,
      dados.especialidade,
      dados.subespecialidades,
      dados.id
    ]);

    await db.promise().query(`
      UPDATE medico_clinica
      SET
        nome_clinica = ?,
        endereco_clinica = ?,
        tempo_consulta = ?,
        valor_consulta = ?
      WHERE id_medico = ?
    `, [
      dados.nome_clinica,
      dados.endereco_clinica,
      dados.tempo_consulta,
      dados.valor_consulta,
      dados.id
    ]);

    return { sucesso: true };

  } catch (err) {
    console.error(err);
    return { sucesso: false };
  }
});

// === SALVAR PREFERÊNCIAS DO MÉDICO ===
ipcMain.handle('atualizar-preferencias', async (event, dados) => {
  try {

    await db.promise().query(`
      UPDATE medico
      SET
        horario_inicio = ?,
        horario_termino = ?
      WHERE id = ?
    `, [
      dados.horario_inicio,
      dados.horario_termino,
      dados.id
    ]);

    return { sucesso: true };

  } catch (err) {
    console.error(err);
    return { sucesso: false };
  }
});

// === SALVAR FOTO DE PERFIL NO BANCO ===
ipcMain.handle('salvar-foto-perfil', async (event, data) => {
    const buffer = Buffer.from(data.foto);

    await db.promise().query(
        "UPDATE medico SET foto_perfil = ? WHERE id = ?",
        [buffer, data.id]
    );
});

// === BUSCAR TODOS OS PRODUTOS ===
ipcMain.handle('buscar-produtos', async () => {
  try {
    const [rows] = await db.promise().query(`
      SELECT p.*, 
        (SELECT MIN(l.data_validade) FROM lotes l WHERE l.id_produto = p.id) AS proxima_validade,
        (SELECT SUM(l.quantidade) FROM lotes l WHERE l.id_produto = p.id) AS total_lotes
      FROM produtos p
      ORDER BY p.nome ASC
    `);
    return rows;
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    throw err;
  }
});

// === BUSCAR LOTES DE UM PRODUTO ===
ipcMain.handle('buscar-lotes', async (event, idProduto) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM lotes WHERE id_produto = ? ORDER BY data_validade ASC',
      [idProduto]
    );
    return rows;
  } catch (err) {
    console.error('Erro ao buscar lotes:', err);
    throw err;
  }
});

// === CADASTRAR PRODUTO ===
ipcMain.handle('cadastrar-produto', async (event, dados) => {
  try {
    const { nome, categoria, quantidade, estoque_min, preco, fornecedor, codigo_barras, tarja_preta } = dados;
    const [result] = await db.promise().query(
      `INSERT INTO produtos (nome, categoria, quantidade, estoque_min, preco, fornecedor, codigo_barras, tarja_preta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, categoria, quantidade, estoque_min, preco, fornecedor, codigo_barras || null, tarja_preta ? 1 : 0]
    );
    return { sucesso: true, id: result.insertId };
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return { sucesso: false, erro: 'Código de barras já cadastrado.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === EDITAR PRODUTO ===
ipcMain.handle('editar-produto', async (event, dados) => {
  try {
    const { id, nome, categoria, estoque_min, preco, fornecedor, codigo_barras, tarja_preta } = dados;
    await db.promise().query(
      `UPDATE produtos SET nome = ?, categoria = ?, estoque_min = ?, preco = ?, fornecedor = ?, codigo_barras = ?, tarja_preta = ?
       WHERE id = ?`,
      [nome, categoria, estoque_min, preco, fornecedor, codigo_barras || null, tarja_preta ? 1 : 0, id]
    );
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return { sucesso: false, erro: 'Código de barras já cadastrado.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === ATUALIZAR ESTOQUE (ENTRADA/SAÍDA + LOTE) ===
ipcMain.handle('atualizar-estoque', async (event, dados) => {
  try {
    const { id_produto, tipo, quantidade, numero_lote, data_validade, prateleira } = dados;
    const qtd = tipo === 'entrada' ? quantidade : -quantidade;

    await db.promise().query(
      'UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?',
      [qtd, id_produto]
    );

    if (numero_lote || data_validade) {
      await db.promise().query(
        `INSERT INTO lotes (id_produto, numero_lote, quantidade, data_validade, prateleira)
         VALUES (?, ?, ?, ?, ?)`,
        [id_produto, numero_lote || null, quantidade, data_validade || null, prateleira || null]
      );
    }

    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar estoque:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === DELETAR PRODUTO ===
ipcMain.handle('deletar-produto', async (event, id) => {
  try {
    await db.promise().query('DELETE FROM produtos WHERE id = ?', [id]);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR LOTES COM VALIDADE PRÓXIMA (até 30 dias) ===
ipcMain.handle('buscar-alertas-validade', async () => {
  try {
    const [rows] = await db.promise().query(`
      SELECT l.*, p.nome AS nome_produto
      FROM lotes l
      JOIN produtos p ON p.id = l.id_produto
      WHERE l.data_validade IS NOT NULL
        AND l.data_validade >= CURDATE()
      ORDER BY l.data_validade ASC
    `);
    return rows;
  } catch (err) {
    console.error('Erro ao buscar alertas de validade:', err);
    throw err;
  }
});

// === REMOVER LOTE (MARCAR COMO RESOLVIDO) ===
ipcMain.handle('remover-lote', async (event, id) => {
  try {
    await db.promise().query('DELETE FROM lotes WHERE id = ?', [id]);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao remover lote:', err);
    return { sucesso: false };
  }
});

// === BUSCAR CUPONS ===
ipcMain.handle('buscar-cupons', async () => {
  try {
    // Expira automaticamente por data ou limite de uso
    await db.promise().query(`
      UPDATE cupons
      SET status = 'expirado'
      WHERE status = 'ativo'
        AND (
          (validade IS NOT NULL AND validade < CURDATE())
          OR (limite_uso > 0 AND usos_atuais >= limite_uso)
        )
    `);

    const [rows] = await db.promise().query('SELECT * FROM cupons ORDER BY status ASC, codigo ASC');
    return rows;
  } catch (err) {
    console.error('Erro ao buscar cupons:', err);
    throw err;
  }
});

// === CADASTRAR CUPOM ===
ipcMain.handle('cadastrar-cupom', async (event, dados) => {
  try {
    const { codigo, descricao, tipo, valor, limite_uso, validade } = dados;
    await db.promise().query(
      `INSERT INTO cupons (codigo, descricao, tipo, valor, limite_uso, usos_atuais, validade, status)
       VALUES (?, ?, ?, ?, ?, 0, ?, 'ativo')`,
      [codigo, descricao, tipo, valor, limite_uso, validade || null]
    );
    return { sucesso: true };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return { sucesso: false, erro: 'Código já existe.' };
    return { sucesso: false, erro: err.message };
  }
});

// === EDITAR CUPOM ===
ipcMain.handle('editar-cupom', async (event, dados) => {
  try {
    const { id, descricao, tipo, valor, limite_uso, validade, status } = dados;
    await db.promise().query(
      `UPDATE cupons SET descricao = ?, tipo = ?, valor = ?, limite_uso = ?, validade = ?, status = ?
       WHERE id = ?`,
      [descricao, tipo, valor, limite_uso, validade || null, status, id]
    );
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

// === DELETAR CUPOM ===
ipcMain.handle('deletar-cupom', async (event, id) => {
  try {
    await db.promise().query('DELETE FROM cupons WHERE id = ?', [id]);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

// === DADOS DO DASHBOARD ===
ipcMain.handle('buscar-dashboard', async () => {
  try {
    const [[estoqueRow]] = await db.promise().query(
      'SELECT COALESCE(SUM(quantidade), 0) AS total FROM produtos'
    );

    const [alertasRows] = await db.promise().query(`
      SELECT l.*, p.nome AS nome_produto
      FROM lotes l
      JOIN produtos p ON p.id = l.id_produto
      WHERE l.data_validade IS NOT NULL
        AND l.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY l.data_validade ASC
    `);

    const [estoqueBaixoRows] = await db.promise().query(`
      SELECT * FROM produtos
      WHERE quantidade < estoque_min
      ORDER BY quantidade ASC
    `);

    const [vendasRows] = await db.promise().query(
      'SELECT total, data_venda FROM vendas_concluidas'
    );

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const vendasDoMes = vendasRows
      .filter(v => {
        const partes = (v.data_venda || '').split('/');
        if (partes.length !== 3) return false;
        return (parseInt(partes[1]) - 1) === mesAtual && parseInt(partes[2]) === anoAtual;
      })
      .reduce((soma, v) => soma + parseFloat(v.total), 0);

    return {
      totalEstoque: estoqueRow.total,
      totalAlertasValidade: alertasRows.length,
      vendasDoMes,
      proximosVencimento: alertasRows.slice(0, 3),
      estoqueBaixo: estoqueBaixoRows.slice(0, 5)
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
    const [rows] = await db.promise().query(
      'SELECT nome, categoria, quantidade, estoque_min, preco, fornecedor FROM produtos ORDER BY nome ASC'
    );
    return rows;
  }

  if (tipo === 'validade') {
    const { inicio, fim } = calcularPeriodoRelatorio('validade', periodo);
    let sql = `
      SELECT p.nome, l.numero_lote, l.quantidade, l.data_validade, l.prateleira
      FROM lotes l JOIN produtos p ON p.id = l.id_produto
      WHERE l.data_validade IS NOT NULL
    `;
    const params = [];
    if (inicio && fim) {
      sql += ' AND l.data_validade BETWEEN ? AND ?';
      params.push(inicio.toISOString().split('T')[0], fim.toISOString().split('T')[0]);
    }
    sql += ' ORDER BY l.data_validade ASC';
    const [rows] = await db.promise().query(sql, params);
    return rows;
  }

  if (tipo === 'vendas') {
    const [rows] = await db.promise().query(
      'SELECT cliente, total, quantidade, metodo_pago, data_venda FROM vendas_concluidas'
    );
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

    await db.promise().query(
      `INSERT INTO relatorios_farmacia (tipo, periodo, formato, nome_arquivo, caminho, tamanho_kb)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo, periodo, formato, nomeArquivo, caminho, tamanhoKb]
    );

    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    return { sucesso: false, erro: err.message };
  }
});

ipcMain.handle('buscar-relatorios-farmacia', async () => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM relatorios_farmacia ORDER BY gerado_em DESC LIMIT 10'
    );
    return rows;
  } catch (err) {
    console.error('Erro ao buscar relatórios:', err);
    throw err;
  }
});

ipcMain.handle('baixar-relatorio-farmacia', async (event, id) => {
  try {
    const [rows] = await db.promise().query('SELECT caminho FROM relatorios_farmacia WHERE id = ?', [id]);
    if (rows.length === 0) return { sucesso: false };
    await shell.openPath(rows[0].caminho);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao abrir relatório:', err);
    return { sucesso: false };
  }
});

ipcMain.handle('buscar-resumo-relatorios', async () => {
  try {
    const [[estoqueRow]] = await db.promise().query('SELECT COALESCE(SUM(quantidade), 0) AS total FROM produtos');

    const [[alertasRow]] = await db.promise().query(`
      SELECT COUNT(*) AS total FROM lotes
      WHERE data_validade IS NOT NULL
        AND data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    const [vendasRows] = await db.promise().query('SELECT total, data_venda FROM vendas_concluidas');

    const somarMes = (mes, ano) => vendasRows
      .filter(v => {
        const partes = (v.data_venda || '').split('/');
        if (partes.length !== 3) return false;
        return (parseInt(partes[1]) - 1) === mes && parseInt(partes[2]) === ano;
      })
      .reduce((soma, v) => soma + parseFloat(v.total), 0);

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const mesAnterior = new Date(anoAtual, mesAtual - 1, 1);

    const vendasMesAtual = somarMes(mesAtual, anoAtual);
    const vendasMesAnterior = somarMes(mesAnterior.getMonth(), mesAnterior.getFullYear());

    const variacaoVendas = vendasMesAnterior > 0
      ? Math.round(((vendasMesAtual - vendasMesAnterior) / vendasMesAnterior) * 100)
      : null;

    return {
      totalEstoque: estoqueRow.total,
      vendasMesAtual,
      variacaoVendas,
      totalAlertas: alertasRow.total
    };
  } catch (err) {
    console.error('Erro ao buscar resumo de relatórios:', err);
    throw err;
  }
});

// === ATUALIZAR DADOS DO FUNCIONÁRIO ===
ipcMain.handle('atualizar-funcionario', async (event, dados) => {
  try {
    const { cpf, nome, email, telefone, funcao, status } = dados;
    await db.promise().query(
      `UPDATE funcFarma
       SET nome = ?, email = ?, telefone = ?, funcao = ?, status = ?
       WHERE CPF = ?`,
      [nome, email, telefone, funcao, status, cpf]
    );
    console.log(`Funcionário ${cpf} atualizado com sucesso`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === CHATBOT API ===
require('dotenv').config();
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