require('dotenv').config();

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  setToken
} = require('./src/api/client');


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
    const resposta = await apiPost('/auth/login', {
      email,
      senha,
      tipo: Number(tipoSelecionado)
    });

    setToken(resposta.token);

    const user = {
      id: resposta.id,
      email: resposta.email,
      tipo: resposta.tipo,
      perfil: resposta.perfil,

      id_medico: resposta.idMedico,
      id_paciente: resposta.idPaciente,
      id_farmacia: resposta.idFarmacia,
      id_balconista: resposta.idBalconista,
      id_caixa: resposta.idCaixa
    };

    console.log('Login realizado pela API com perfil:', user.perfil);

    return user;
  } catch (err) {
    if (
      err.message &&
      err.message.includes('Email ou senha incorretos')
    ) {
      return null;
    }

    console.error('Erro ao realizar login pela API:', err);
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

// === CADASTRAR PRONTUÁRIO ===
ipcMain.handle('cadastrar-prontuario', async (event, dados) => {
  try {
    const {
      idMedico,
      idPaciente,
      nomePaciente,
      idade,
      tipo,
      dataAtendimento,
      pa,
      temperatura,
      peso,
      spo2,
      diagnostico,
      cid10,
      anamnese,
      exameFisico,
      conduta,
      dataRetorno
    } = dados;

    const [result] = await db.promise().query(`
      INSERT INTO prontuario (
        id_medico,
        id_paciente,
        nome_paciente,
        idade,
        condicao,
        ultima_visita,
        status,
        tipo,
        cid10,
        anamnese,
        exame_fisico,
        conduta,
        data_retorno,
        pa,
        temperatura,
        peso,
        spo2
      )
      VALUES (?, ?, ?, ?, ?, ?, 'Ativo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      idMedico,
      idPaciente,
      nomePaciente,
      idade,
      diagnostico,
      dataAtendimento,
      tipo,
      cid10 || null,
      anamnese,
      exameFisico || null,
      conduta || null,
      dataRetorno || null,
      pa || null,
      temperatura || null,
      peso || null,
      spo2 || null
    ]);

    return {
      sucesso: true,
      id: result.insertId
    };
  } catch (err) {
    console.error('Erro ao cadastrar prontuário:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === BUSCAR RECEITAS ===
ipcMain.handle(
  'buscar-receitas',
  async (event, idPaciente, idMedico) => {
    const [rows] = await db.promise().query(`
      SELECT *
      FROM receita
      WHERE id_paciente = ?
        AND id_medico = ?
      ORDER BY id DESC
    `, [idPaciente, idMedico]);

    return rows;
  }
);

// === CADASTRAR PARCEIRO ===
ipcMain.handle('cadastrar-parceiro', async (event, novoParceiro) => {
  try {
    const { idMedico, parceiro, tipo, email, telefone, desconto, dataInicio } = novoParceiro;
    const sql = `
      INSERT INTO parceiros (id_medico, nome, tipo, email, telefone, desconto, status, data_inicio)
      VALUES (?, ?, ?, ?, ?, ?, 'ativo', STR_TO_DATE(?, '%d/%m/%Y'))
    `;
    const [result] = await db.promise().query(sql, [
      idMedico, parceiro, tipo, email, telefone, desconto, dataInicio,
    ]);
    console.log('Parceiro cadastrado com sucesso!');
    return result;
  } catch (err) {
    console.error('Erro ao cadastrar parceiro:', err);
    throw err;
  }
});

// === BUSCAR PARCEIROS (do médico logado) ===
ipcMain.handle('buscar-parceiros', async (event, idMedico) => {
  try {
    const [parceiros] = await db.promise().query(`
      SELECT
        p.id,
        p.nome,
        p.tipo,
        p.email,
        p.telefone,
        p.desconto,
        p.status,
        DATE_FORMAT(p.data_inicio, '%d/%m/%Y') AS dataInicio,
        (SELECT COUNT(*) FROM parceiro_encaminhamentos pe
         WHERE pe.id_parceiro = p.id
         AND MONTH(pe.data_encaminhamento) = MONTH(CURDATE())
         AND YEAR(pe.data_encaminhamento) = YEAR(CURDATE())
        ) AS encaminhamentosMes
      FROM parceiros p
      WHERE p.id_medico = ?
      ORDER BY p.nome
    `, [idMedico]);

    const [servicos] = await db.promise().query(`
      SELECT ps.id_parceiro, ps.nome_servico
      FROM parceiro_servicos ps
      INNER JOIN parceiros p ON p.id = ps.id_parceiro
      WHERE p.id_medico = ?
    `, [idMedico]);

    const parceirosComServicos = parceiros.map(p => ({
      ...p,
      servicos: servicos.filter(s => s.id_parceiro === p.id).map(s => s.nome_servico)
    }));

    return parceirosComServicos;
  } catch (err) {
    console.error('Erro ao buscar parceiros:', err);
    throw err;
  }
});

// === BUSCAR TELECONSULTAS DO MÉDICO PELA API ===
ipcMain.handle(
  'buscar-consultas-medico',
  async (event, idMedico) => {
    try {
      if (!idMedico) {
        throw new Error(
          'Identificador do médico não informado.'
        );
      }

      const consultas = await apiGet(
        `/api/teleconsultas/medico/${encodeURIComponent(idMedico)}`
      );

      return consultas;
    } catch (err) {
      console.error(
        'Erro ao buscar consultas do médico pela API:',
        err
      );

      throw err;
    }
  }
);

// === CADASTRAR FUNCIONÁRIO PELA API ===
ipcMain.handle('cadastrar-funcionario', async (event, novoFuncionario) => {
  try {
    const { cpf, nome, email, telefone, funcao, status, idFarmacia } = novoFuncionario;

    const funcionarioCriado = await apiPost('/api/funcionarios', {
      cpf: cpf.trim(),
      nome: nome.trim(),
      email: email ? email.trim() : '',
      telefone: telefone ? telefone.trim() : '',
      funcao,
      status: status || 'ativo',
      idFarmacia
    });

    return { sucesso: true, resultado: funcionarioCriado };
  } catch (err) {
    console.error('Erro ao cadastrar funcionário pela API:', err);
    if (err.message && err.message.includes('CPF já cadastrado')) {
      return { sucesso: false, erro: 'CPF já cadastrado.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR FUNCIONÁRIOS PELA API ===
ipcMain.handle('buscar-funcionarios', async (event, idFarmacia) => {
  try {
    const funcionarios = await apiGet(`/api/funcionarios?idFarmacia=${encodeURIComponent(idFarmacia)}`);
    return funcionarios.map(funcionario => ({ ...funcionario, CPF: funcionario.cpf }));
  } catch (err) {
    console.error('Erro ao buscar funcionários pela API:', err);
    throw err;
  }
});

// === ATUALIZAR STATUS DO FUNCIONÁRIO PELA API ===
ipcMain.handle(
  'atualizar-status-funcionario',
  async (event, dados) => {
    try {
      const {
        cpf,
        status
      } = dados;

      if (!cpf) {
        return {
          sucesso: false,
          erro: 'Funcionário não informado.'
        };
      }

      if (status !== 'ativo' && status !== 'inativo') {
        return {
          sucesso: false,
          erro: 'Status inválido.'
        };
      }

      await apiPatch(
        `/api/funcionarios/${encodeURIComponent(cpf)}/status`,
        {
          status
        }
      );

      return {
        sucesso: true
      };
    } catch (err) {
      console.error(
        'Erro ao atualizar status do funcionário pela API:',
        err
      );

      return {
        sucesso: false,
        erro: err.message
      };
    }
  }
);

// === SALVAR VENDA PELA API ===
ipcMain.handle('salvar-venda', async (_event, venda) => {
  try {
    let totalNum = venda.total;

    if (typeof totalNum === 'string') {
      totalNum = parseFloat(
        totalNum
          .replace('R$', '')
          .replace(',', '.')
          .trim()
      );
    }

    let trocoNum = venda.troco;

    if (typeof trocoNum === 'string') {
      trocoNum = parseFloat(
        trocoNum
          .replace('R$', '')
          .replace(',', '.')
          .trim()
      );
    }

    await apiPost('/api/vendas', {
      id: String(venda.id),
      cliente: venda.cliente || 'Cliente não informado',
      total: Number(totalNum) || 0,
      quantidade: Number(venda.quantidade) || (Array.isArray(venda.produtos) ? venda.produtos.length : 0),
      metodoPago: venda.metodoPago || null,
      troco: Number(trocoNum) || 0,
      dataVenda: venda.dataVenda || null,
      produtos: JSON.stringify(venda.produtos || []),
      idFarmacia: venda.idFarmacia
    });

    return { ok: true };
  } catch (err) {
    console.error('Erro ao salvar venda pela API:', err);
    return { ok: false, erro: err.message };
  }
});

// === BUSCAR VENDAS PELA API ===
ipcMain.handle('buscar-vendas', async (_event, { dataInicio, dataFim, idFarmacia } = {}) => {
    try {
      const vendas = await apiGet(`/api/vendas?idFarmacia=${encodeURIComponent(idFarmacia)}`);

      const inicio = dataInicio
        ? new Date(`${dataInicio}T00:00:00`)
        : null;

      const fim = dataFim
        ? new Date(`${dataFim}T23:59:59`)
        : null;

      const vendasFiltradas = vendas.filter(venda => {
        if (!venda.dataVenda) {
          return false;
        }


        const partes = venda.dataVenda.split('/');

        if (partes.length !== 3) {
          return false;
        }

        const [dia, mes, ano] = partes;

        const dataVenda = new Date(
          Number(ano),
          Number(mes) - 1,
          Number(dia),
          12,
          0,
          0
        );

        if (inicio && dataVenda < inicio) {
          return false;
        }

        if (fim && dataVenda > fim) {
          return false;
        }

        return true;
      });

      return vendasFiltradas.map(venda => {
        let produtos = [];

        try {
          produtos = typeof venda.produtos === 'string'
            ? JSON.parse(venda.produtos || '[]')
            : venda.produtos || [];
        } catch (erroJson) {
          console.error(
            'Produtos da venda não estão em JSON válido:',
            venda.id
          );
        }

        return {
          ...venda,

          metodo_pago: venda.metodoPago,
          data_venda: venda.dataVenda,
          produtos
        };
      });
    } catch (err) {
      console.error('Erro ao buscar vendas pela API:', err);
      throw err;
    }
  }
);

// === CADASTRAR CLIENTE PELA API ===
ipcMain.handle('cadastrar-cliente', async (_event, cliente) => {
  try {
    const {
      cpf,
      nome,
      telefone,
      email,
      idFarmacia
    } = cliente;

    await apiPost('/api/clientes', {
      cpf: cpf.trim(),
      nome: nome.trim(),

      telefone: telefone ? telefone.trim() : '',
      email: email ? email.trim() : '',
      idFarmacia: Number(idFarmacia)
    });

    return {
      sucesso: true
    };
  } catch (err) {
    console.error('Erro ao cadastrar cliente pela API:', err);

    if (
      err.message &&
      err.message.includes('CPF já cadastrado')
    ) {
      return {
        sucesso: false,
        erro: 'CPF já cadastrado.'
      };
    }

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === BUSCAR CLIENTE POR CPF PELA API ===
ipcMain.handle('buscar-cliente', async (_event, cpf, idFarmacia) => {
  try {
    const cliente = await apiGet(
      `/api/clientes/${encodeURIComponent(cpf.trim())}` +
      `?idFarmacia=${encodeURIComponent(idFarmacia)}`
    );

    // A tela atual utiliza cliente.CPF em maiúsculas.
    return {
      ...cliente,
      CPF: cliente.cpf
    };
  } catch (err) {
    // Cliente não encontrado não deve aparecer como erro
    if (
      err.message &&
      err.message.includes('Erro HTTP 404')
    ) {
      return null;
    }

    console.error('Erro ao buscar cliente pela API:', err);
    return null;
  }
});

// === SALVAR TELECONSULTA PELA API ===
ipcMain.handle(
  'salvarConsulta',
  async (event, consulta) => {
    try {
      const teleconsultaCriada = await apiPost(
        '/api/teleconsultas',
        {
          idMedico: Number(consulta.id_medico),
          idPaciente: Number(consulta.paciente_id),
          nomePaciente: consulta.nome_paciente,
          data: consulta.data,
          horario: consulta.horario,
          tipo: consulta.tipo || null,
          duracao: consulta.duracao || null,
          status: 'Pendente'
        }
      );

      return {
        sucesso: true,
        id: teleconsultaCriada.id
      };
    } catch (err) {
      console.error(
        'Erro ao salvar teleconsulta pela API:',
        err
      );

      return {
        sucesso: false,
        erro: err.message
      };
    }
  }
);

// === REAGENDAR TELECONSULTA ===
ipcMain.handle("reagendarConsulta", async (event, dados) => {
  try {
    const { id, novaData, novoHorario, novaDuracao } = dados;

    const sql = `
      UPDATE teleconsulta
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

// === BUSCAR PACIENTES MÉDICOS PELA API ===
ipcMain.handle('buscar-pacientes', async () => {
  try {
    const pacientes = await apiGet('/api/pacientes');

    return pacientes;
  } catch (err) {
    console.error(
      'Erro ao buscar pacientes pela API:',
      err
    );

    throw err;
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
ipcMain.handle('salvar-relatorio', async (event, dados) => {
  try {
    const {
      idPaciente,
      idMedico,
      titulo,
      tipo,
      data,
      caminho
    } = dados;

    if (!caminho) {
      return {
        sucesso: false,
        erro: 'Nenhum arquivo foi selecionado.'
      };
    }

    if (!fs.existsSync(caminho)) {
      return {
        sucesso: false,
        erro: 'O arquivo selecionado não foi encontrado.'
      };
    }

    const arquivoBuffer = fs.readFileSync(caminho);

    const [result] = await db.promise().query(`
      INSERT INTO relatorios (
        id_paciente,
        id_medico,
        titulo,
        tipo,
        data,
        arquivo
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      idPaciente,
      idMedico,
      titulo,
      tipo || 'PDF',
      data,
      arquivoBuffer
    ]);

    return {
      sucesso: true,
      id: result.insertId
    };
  } catch (err) {
    console.error('Erro ao salvar relatório:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === BUSCAR RELATORIOS DO BANCO ===
ipcMain.handle(
  'buscar-relatorios',
  async (event, idPaciente, idMedico) => {
    const [rows] = await db.promise().query(`
      SELECT id, id_paciente, id_medico, titulo, tipo, data
      FROM relatorios
      WHERE id_paciente = ?
        AND id_medico = ?
      ORDER BY id DESC
    `, [idPaciente, idMedico]);

    return rows;
  }
);

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
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const [resultadoMedico] = await connection.query(`
      UPDATE medico
      SET crm = ?,
          rqe = ?,
          especialidade = ?,
          subespecialidades = ?
      WHERE id = ?
    `, [
      dados.crm || null,
      dados.rqe || null,
      dados.especialidade || null,
      dados.subespecialidades || null,
      dados.id
    ]);

    if (resultadoMedico.affectedRows === 0) {
      throw new Error('Médico não encontrado.');
    }

    await connection.query(`
      INSERT INTO medico_clinica (
        id_medico,
        nome_clinica,
        endereco_clinica,
        tempo_consulta,
        valor_consulta
      )
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nome_clinica = VALUES(nome_clinica),
        endereco_clinica = VALUES(endereco_clinica),
        tempo_consulta = VALUES(tempo_consulta),
        valor_consulta = VALUES(valor_consulta)
    `, [
      dados.id,
      dados.nome_clinica || null,
      dados.endereco_clinica || null,
      dados.tempo_consulta || null,
      dados.valor_consulta === '' ? null : dados.valor_consulta
    ]);

    await connection.commit();
    return { sucesso: true };
  } catch (err) {
    await connection.rollback();
    console.error('Erro ao atualizar dados profissionais:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  } finally {
    connection.release();
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
ipcMain.handle('buscar-produtos', async (event, idFarmacia) => {
  try {
    const produtos = await apiGet(`/api/produtos?idFarmacia=${encodeURIComponent(idFarmacia)}`);
    return produtos.map(produto => ({
      ...produto,
      estoque_min: produto.estoqueMin,
      codigo_barras: produto.codigoBarras,
      tarja_preta: produto.tarjaPreta,
      criado_em: produto.criadoEm,
      proxima_validade: produto.proximaValidade,
      total_lotes: produto.totalLotes
    }));
  } catch (err) {
    console.error('Erro ao buscar produtos pela API:', err);
    throw err;
  }
});

// === BUSCAR LOTES DE UM PRODUTO PELA API ===
ipcMain.handle('buscar-lotes', async (event, idProduto) => {
  try {
    const lotes = await apiGet(
      `/api/lotes/produto/${encodeURIComponent(idProduto)}`
    );

    // Converte os nomes da API para os nomes usados em estoque.html
    return lotes.map(lote => ({
      ...lote,
      id_produto: lote.idProduto,
      numero_lote: lote.numeroLote,
      data_validade: lote.dataValidade
    }));
  } catch (err) {
    console.error('Erro ao buscar lotes pela API:', err);
    throw err;
  }
});

// === CADASTRAR PRODUTO PELA API ===
ipcMain.handle('cadastrar-produto', async (event, dados) => {
  try {
    const {
      nome, categoria, quantidade, estoque_min, preco,
      fornecedor, codigo_barras, tarja_preta, idFarmacia
    } = dados;

    const produtoCriado = await apiPost('/api/produtos', {
      nome, categoria,
      quantidade: Number(quantidade) || 0,
      estoqueMin: Number(estoque_min) || 0,
      preco: Number(preco) || 0,
      fornecedor: fornecedor || null,
      codigoBarras: codigo_barras || null,
      tarjaPreta: Boolean(tarja_preta),
      idFarmacia
    });

    return { sucesso: true, id: produtoCriado.id };
  } catch (err) {
    console.error('Erro ao cadastrar produto pela API:', err);
    if (err.message && err.message.includes('Código de barras já cadastrado')) {
      return { sucesso: false, erro: 'Código de barras já cadastrado.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === EDITAR PRODUTO PELA API ===
ipcMain.handle('editar-produto', async (event, dados) => {
  try {
    const {
      id,
      nome,
      categoria,
      estoque_min,
      preco,
      fornecedor,
      codigo_barras,
      tarja_preta
    } = dados;

    // Busca primeiro o produto atual para preservar campos
    // que não aparecem no formulário, principalmente a quantidade.
    const produtoAtual = await apiGet(
      `/api/produtos/${encodeURIComponent(id)}`
    );

    await apiPut(
      `/api/produtos/${encodeURIComponent(id)}`,
      {
        nome,
        categoria,
        quantidade: produtoAtual.quantidade,
        estoqueMin: Number(estoque_min) || 0,
        preco: Number(preco) || 0,
        fornecedor: fornecedor || null,
        codigoBarras: codigo_barras || null,
        tarjaPreta: Boolean(tarja_preta)
      }
    );

    return {
      sucesso: true
    };
  } catch (err) {
    console.error('Erro ao editar produto pela API:', err);

    if (
      err.message &&
      err.message.includes('Código de barras já cadastrado')
    ) {
      return {
        sucesso: false,
        erro: 'Código de barras já cadastrado.'
      };
    }

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === ATUALIZAR ESTOQUE E CADASTRAR LOTE PELA API ===
ipcMain.handle('atualizar-estoque', async (event, dados) => {
  try {
    const {
      id_produto,
      tipo,
      quantidade,
      numero_lote,
      data_validade,
      prateleira
    } = dados;

    if (!id_produto) {
      return {
        sucesso: false,
        erro: 'Produto não informado.'
      };
    }

    if (!quantidade || Number(quantidade) <= 0) {
      return {
        sucesso: false,
        erro: 'Informe uma quantidade maior que zero.'
      };
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
      return {
        sucesso: false,
        erro: 'Tipo de movimentação inválido.'
      };
    }

    await apiPost('/api/lotes', {
      idProduto: Number(id_produto),
      tipo,
      quantidade: Number(quantidade),
      numeroLote: numero_lote || null,
      dataValidade: data_validade || null,
      prateleira: prateleira || null
    });

    return {
      sucesso: true
    };
  } catch (err) {
    console.error('Erro ao atualizar estoque pela API:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === DELETAR PRODUTO PELA API ===
ipcMain.handle('deletar-produto', async (event, id) => {
  try {
    if (!id) {
      return {
        sucesso: false,
        erro: 'Produto não informado.'
      };
    }

    await apiDelete(
      `/api/produtos/${encodeURIComponent(id)}`
    );

    return {
      sucesso: true
    };
  } catch (err) {
    console.error('Erro ao deletar produto pela API:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === BUSCAR ALERTAS DE VALIDADE PELA API ===
ipcMain.handle('buscar-alertas-validade', async (event, idFarmacia) => {
  try {
    const lotes = await apiGet(`/api/lotes?idFarmacia=${encodeURIComponent(idFarmacia)}`);
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataHoje = `${ano}-${mes}-${dia}`;

    return lotes
      .filter(lote => lote.dataValidade && lote.dataValidade >= dataHoje)
      .map(lote => ({
        ...lote,
        id_produto: lote.idProduto,
        numero_lote: lote.numeroLote,
        data_validade: lote.dataValidade,
        nome_produto: lote.nomeProduto
      }));
  } catch (err) {
    console.error('Erro ao buscar alertas de validade pela API:', err);
    throw err;
  }
});

// === REMOVER LOTE PELA API (MARCA COMO RESOLVIDO  )===
ipcMain.handle('remover-lote', async (event, id) => {
  try {
    if (!id) {
      return {
        sucesso: false,
        erro: 'Lote não informado.'
      };
    }

    await apiDelete(
      `/api/lotes/${encodeURIComponent(id)}`
    );

    return {
      sucesso: true
    };
  } catch (err) {
    console.error('Erro ao remover lote pela API:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === BUSCAR CUPONS PELA API ===
ipcMain.handle('buscar-cupons', async (event, idFarmacia) => {
  try {
    const cupons = await apiGet(`/api/cupons?idFarmacia=${encodeURIComponent(idFarmacia)}`);
    return cupons.map(cupom => ({ ...cupom, limite_uso: cupom.limiteUso, usos_atuais: cupom.usosAtuais }));
  } catch (err) {
    console.error('Erro ao buscar cupons pela API:', err);
    throw err;
  }
});

// === CADASTRAR CUPOM PELA API ===
ipcMain.handle('cadastrar-cupom', async (event, dados) => {
  try {
    const { codigo, descricao, tipo, valor, limite_uso, validade, idFarmacia } = dados;

    const cupomCriado = await apiPost('/api/cupons', {
      codigo: codigo.trim().toUpperCase(),
      descricao: descricao || null,
      tipo,
      valor: Number(valor) || 0,
      limiteUso: Number(limite_uso) || 0,
      validade: validade || null,
      idFarmacia
    });

    return { sucesso: true, id: cupomCriado.id };
  } catch (err) {
    console.error('Erro ao cadastrar cupom pela API:', err);
    if (err.message && err.message.includes('Código já existe')) {
      return { sucesso: false, erro: 'Já existe um cupom com esse código.' };
    }
    return { sucesso: false, erro: err.message };
  }
});

// === EDITAR CUPOM PELA API ===
ipcMain.handle('editar-cupom', async (event, dados) => {
  try {
    const { id, descricao, tipo, valor, limite_uso, validade, status, idFarmacia } = dados;

    // Agora /api/cupons exige idFarmacia — buscamos só os da farmácia certa
    const cupons = await apiGet(`/api/cupons?idFarmacia=${encodeURIComponent(idFarmacia)}`);
    const cupomAtual = cupons.find(cupom => Number(cupom.id) === Number(id));

    if (!cupomAtual) {
      return { sucesso: false, erro: 'Cupom não encontrado.' };
    }

    await apiPut(`/api/cupons/${encodeURIComponent(id)}`, {
      codigo: cupomAtual.codigo,
      descricao: descricao || null,
      tipo,
      valor: Number(valor) || 0,
      limiteUso: Number(limite_uso) || 0,
      usosAtuais: cupomAtual.usosAtuais || 0,
      validade: validade || null,
      status,
      idFarmacia
    });

    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao editar cupom pela API:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === DELETAR CUPOM PELA API ===
ipcMain.handle('deletar-cupom', async (event, id) => {
  try {
    if (!id) {
      return {
        sucesso: false,
        erro: 'Cupom não informado.'
      };
    }

    await apiDelete(
      `/api/cupons/${encodeURIComponent(id)}`
    );

    return {
      sucesso: true
    };
  } catch (err) {
    console.error('Erro ao deletar cupom pela API:', err);

    return {
      sucesso: false,
      erro: err.message
    };
  }
});

// === DADOS DO DASHBOARD ===
ipcMain.handle('buscar-dashboard', async (event, idFarmacia) => {
  try {
    const [[estoqueRow]] = await db.promise().query(
      'SELECT COALESCE(SUM(quantidade), 0) AS total FROM produtos WHERE id_farmacia = ?',
      [idFarmacia]
    );

    const [alertasRows] = await db.promise().query(`
      SELECT l.*, p.nome AS nome_produto
      FROM lotes l
      JOIN produtos p ON p.id = l.id_produto
      WHERE p.id_farmacia = ?
        AND l.data_validade IS NOT NULL
        AND l.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY l.data_validade ASC
    `, [idFarmacia]);

    const [estoqueBaixoRows] = await db.promise().query(`
      SELECT * FROM produtos
      WHERE id_farmacia = ? AND quantidade < estoque_min
      ORDER BY quantidade ASC
    `, [idFarmacia]);

    const [vendasRows] = await db.promise().query(
      'SELECT total, data_venda FROM vendas_concluidas WHERE id_farmacia = ?',
      [idFarmacia]
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

function gerarPDF(dados, caminho, titulo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4'
    });

    const arquivo = fs.createWriteStream(caminho);

    arquivo.on('finish', resolve);
    arquivo.on('error', reject);
    doc.on('error', reject);

    doc.pipe(arquivo);

    doc
      .fontSize(18)
      .text(titulo || 'Relatório FarmaGrid', {
        align: 'center'
      });

    doc.moveDown();
    doc.fontSize(10).text(
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`
    );
    doc.moveDown();

    if (!dados || dados.length === 0) {
      doc.fontSize(12).text(
        'Nenhum dado encontrado para o período selecionado.'
      );
    } else {
      dados.forEach((item, indice) => {
        doc
          .fontSize(11)
          .fillColor('#234e2d')
          .text(`Registro ${indice + 1}`);

        doc.fillColor('#000000').fontSize(9);

        Object.entries(item).forEach(([campo, valor]) => {
          const texto = valor === null || valor === undefined
            ? '—'
            : String(valor);

          doc.text(`${campo}: ${texto}`);
        });

        doc.moveDown();
      });
    }

    doc.end();
  });
}

function gerarXLSX(dados, caminho) {
  const registros = Array.isArray(dados) ? dados : [];

  const planilha = XLSX.utils.json_to_sheet(registros);

  if (registros.length === 0) {
    XLSX.utils.sheet_add_aoa(
      planilha,
      [['Nenhum dado encontrado para o período selecionado.']],
      { origin: 'A1' }
    );
  }

  const arquivoExcel = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    arquivoExcel,
    planilha,
    'Relatório'
  );

  XLSX.writeFile(arquivoExcel, caminho);
}

function gerarCSV(dados, caminho) {
  const registros = Array.isArray(dados) ? dados : [];

  let conteudo;

  if (registros.length === 0) {
    conteudo = 'Mensagem\r\n"Nenhum dado encontrado para o período selecionado."';
  } else {
    conteudo = XLSX.utils.sheet_to_csv(
      XLSX.utils.json_to_sheet(registros),
      {
        FS: ';',
        RS: '\r\n'
      }
    );
  }

  // permite que o Excel reconheça corretamente acentos em UTF-8.
  fs.writeFileSync(
    caminho,
    '\uFEFF' + conteudo,
    'utf8'
  );
}

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

async function buscarDadosRelatorio(tipo, periodo, idFarmacia) {
  if (tipo === 'estoque') {
    const [rows] = await db.promise().query(
      'SELECT nome, categoria, quantidade, estoque_min, preco, fornecedor FROM produtos WHERE id_farmacia = ? ORDER BY nome ASC',
      [idFarmacia]
    );
    return rows;
  }

  if (tipo === 'validade') {
    const { inicio, fim } = calcularPeriodoRelatorio('validade', periodo);
    let sql = `
      SELECT p.nome, l.numero_lote, l.quantidade, l.data_validade, l.prateleira
      FROM lotes l JOIN produtos p ON p.id = l.id_produto
      WHERE p.id_farmacia = ? AND l.data_validade IS NOT NULL
    `;
    const params = [idFarmacia];
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
      'SELECT cliente, total, quantidade, metodo_pago, data_venda FROM vendas_concluidas WHERE id_farmacia = ?',
      [idFarmacia]
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

ipcMain.handle('gerar-relatorio-farmacia', async (event, { tipo, periodo, formato, idFarmacia }) => {
  try {
    const rows = await buscarDadosRelatorio(tipo, periodo, idFarmacia);

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
      `INSERT INTO relatorios_farmacia (tipo, periodo, formato, nome_arquivo, caminho, tamanho_kb, id_farmacia)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tipo, periodo, formato, nomeArquivo, caminho, tamanhoKb, idFarmacia]
    );

    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    return { sucesso: false, erro: err.message };
  }
});

ipcMain.handle('buscar-relatorios-farmacia', async (event, idFarmacia) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM relatorios_farmacia WHERE id_farmacia = ? ORDER BY gerado_em DESC LIMIT 10',
      [idFarmacia]
    );
    return rows;
  } catch (err) {
    console.error('Erro ao buscar relatórios:', err);
    throw err;
  }
});

ipcMain.handle('baixar-relatorio-farmacia', async (event, { id, idFarmacia }) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT caminho FROM relatorios_farmacia WHERE id = ? AND id_farmacia = ?',
      [id, idFarmacia]
    );
    if (rows.length === 0) return { sucesso: false };
    await shell.openPath(rows[0].caminho);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao abrir relatório:', err);
    return { sucesso: false };
  }
});

ipcMain.handle('buscar-resumo-relatorios', async (event, idFarmacia) => {
  try {
    const [[estoqueRow]] = await db.promise().query(
      'SELECT COALESCE(SUM(quantidade), 0) AS total FROM produtos WHERE id_farmacia = ?',
      [idFarmacia]
    );

    const [[alertasRow]] = await db.promise().query(`
      SELECT COUNT(*) AS total FROM lotes l
      JOIN produtos p ON p.id = l.id_produto
      WHERE p.id_farmacia = ?
        AND l.data_validade IS NOT NULL
        AND l.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `, [idFarmacia]);

    const [vendasRows] = await db.promise().query(
      'SELECT total, data_venda FROM vendas_concluidas WHERE id_farmacia = ?',
      [idFarmacia]
    );

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
    const { cpf, nome, email, telefone, funcao, status, idFarmacia } = dados;
    const cpfLimpo = cpf.replace(/\D/g, '');

    const [resultado] = await db.promise().query(
      `UPDATE funcFarma
       SET nome = ?, email = ?, telefone = ?, funcao = ?, status = ?
       WHERE id_farmacia = ?
         AND REPLACE(REPLACE(REPLACE(CPF, '.', ''), '-', ''), ' ', '') = ?`,
      [nome, email, telefone, funcao, status, idFarmacia, cpfLimpo]
    );

    if (resultado.affectedRows === 0) {
      return { sucesso: false, erro: 'Funcionário não encontrado pelo CPF informado.' };
    }

    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR DADOS DO PRÓPRIO FUNCIONÁRIO (SIDEBAR BALCONISTA/CAIXA) ===
ipcMain.handle('buscar-dados-funcionario', async (event, cpf) => {
  try {
    const funcionario = await apiGet(`/api/funcionarios/${encodeURIComponent(cpf)}`);
    return funcionario;
  } catch (err) {
    console.error('Erro ao buscar dados do funcionário:', err);
    return null;
  }
});

// === ATUALIZAR STATUS DO PARCEIRO ===
ipcMain.handle('atualizar-status-parceiro', async (event, dados) => {
  try {
    const { id, status } = dados;
    await db.promise().query(
      'UPDATE parceiros SET status = ? WHERE id = ?',
      [status, id]
    );
    console.log(`Status do parceiro ${id} atualizado para ${status}`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar status do parceiro:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === ATUALIZAR DESCONTO DO PARCEIRO ===
ipcMain.handle('atualizar-desconto-parceiro', async (event, dados) => {
  try {
    const { id, desconto } = dados;
    await db.promise().query(
      'UPDATE parceiros SET desconto = ? WHERE id = ?',
      [desconto, id]
    );
    console.log(`Desconto do parceiro ${id} atualizado para ${desconto}`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar desconto do parceiro:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === ADICIONAR SERVIÇO AO PARCEIRO ===
ipcMain.handle('adicionar-servico-parceiro', async (event, dados) => {
  try {
    const { idParceiro, nomeServico, categoria, descricao } = dados;
    const [result] = await db.promise().query(
      'INSERT INTO parceiro_servicos (id_parceiro, nome_servico, categoria, descricao) VALUES (?, ?, ?, ?)',
      [idParceiro, nomeServico, categoria || null, descricao || null]
    );
    console.log('Serviço adicionado ao parceiro:', nomeServico);
    return { sucesso: true, id: result.insertId };
  } catch (err) {
    console.error('Erro ao adicionar serviço:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR PACIENTES (para o modal de encaminhamento) ===
ipcMain.handle(
  'buscar-pacientes-medico',
  async (event, idMedico) => {
    try {
      if (!idMedico) {
        throw new Error('Médico não identificado.');
      }

      const [rows] = await db.promise().query(`
        SELECT DISTINCT
          pac.id,
          pac.nome,
          pac.data_nascimento
        FROM paciente pac
        INNER JOIN teleconsulta tc
          ON tc.id_paciente = pac.id
        WHERE tc.id_medico = ?
        ORDER BY pac.nome
      `, [idMedico]);

      return rows;
    } catch (err) {
      console.error(
        'Erro ao buscar pacientes do médico:',
        err
      );

      throw err;
    }
  }
);

// === ENCAMINHAR PACIENTE PARA PARCEIRO ===
ipcMain.handle('encaminhar-paciente-parceiro', async (event, dados) => {
  try {
    const { idParceiro, idPaciente } = dados;
    await db.promise().query(
      'INSERT INTO parceiro_encaminhamentos (id_parceiro, id_paciente) VALUES (?, ?)',
      [idParceiro, idPaciente || null]
    );
    console.log(`Encaminhamento registrado para o parceiro ${idParceiro}`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao registrar encaminhamento:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR PRONTUÁRIO MAIS RECENTE DE UM PACIENTE ===
ipcMain.handle('buscar-prontuario-recente', async (event, idPaciente) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM prontuario WHERE id_paciente = ? ORDER BY id DESC LIMIT 1',
      [idPaciente]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('Erro ao buscar prontuário recente:', err);
    throw err;
  }
});

// === BUSCAR LISTA DE PACIENTES (para sidebar, com CPF real) ===
ipcMain.handle('buscar-pacientes-prontuario', async (event, idMedico) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT DISTINCT
        pac.id,
        pac.nome AS nome_paciente,
        pac.idade,
        pac.CPF,
        (SELECT pr.condicao FROM prontuario pr WHERE pr.id_paciente = pac.id ORDER BY pr.id DESC LIMIT 1) AS condicao,
        (SELECT pr.ultima_visita FROM prontuario pr WHERE pr.id_paciente = pac.id ORDER BY pr.id DESC LIMIT 1) AS ultima_visita,
        (SELECT pr.status FROM prontuario pr WHERE pr.id_paciente = pac.id ORDER BY pr.id DESC LIMIT 1) AS status
      FROM paciente pac
      INNER JOIN teleconsulta tc ON tc.id_paciente = pac.id
      WHERE tc.id_medico = ?
      ORDER BY pac.nome
    `, [idMedico]);
    return rows;
  } catch (err) {
    console.error('Erro ao buscar pacientes:', err);
    throw err;
  }
});

// === BUSCAR TODOS OS PRONTUÁRIOS DE UM PACIENTE ===
ipcMain.handle(
  'buscar-prontuarios-paciente',
  async (event, idPaciente, idMedico) => {
    const [rows] = await db.promise().query(`
      SELECT *
      FROM prontuario
      WHERE id_paciente = ?
        AND id_medico = ?
      ORDER BY id DESC
    `, [idPaciente, idMedico]);

    return rows;
  }
);

// === CADASTRAR RECEITA ===
ipcMain.handle('cadastrar-receita', async (event, dados) => {
  try {
    const {
      idMedico, idPaciente, medicamento, concentracao,
      dosagem, frequencia, duracao, viaAdministracao,
      instrucoes, observacoes
    } = dados;

    const hoje = new Date();
    const dataPrescricao = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    const [result] = await db.promise().query(
      `INSERT INTO receita
        (id_medico, id_paciente, medicamento, concentracao, dosagem, frequencia, duracao, via_administracao, instrucoes, observacoes, status, data_prescricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ativa', ?)`,
      [
        idMedico, idPaciente, medicamento, concentracao || null,
        dosagem, frequencia || null, duracao || null, viaAdministracao || null,
        instrucoes || null, observacoes || null, dataPrescricao
      ]
    );

    console.log('Receita cadastrada com sucesso!');
    return { sucesso: true, id: result.insertId };
  } catch (err) {
    console.error('Erro ao cadastrar receita:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === ATUALIZAR SENHA DO MÉDICO ===
ipcMain.handle('atualizar-senha', async (event, dados) => {
  try {
    const { idLogin, senhaAtual, novaSenha } = dados;

    const [rows] = await db.promise().query(
      'SELECT senha FROM login WHERE id = ? LIMIT 1',
      [idLogin]
    );

    if (rows.length === 0) {
      return { sucesso: false, erro: 'Usuário não encontrado.' };
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, rows[0].senha);
    if (!senhaCorreta) {
      return { sucesso: false, erro: 'Senha atual incorreta.' };
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await db.promise().query(
      'UPDATE login SET senha = ? WHERE id = ?',
      [novaSenhaHash, idLogin]
    );

    console.log(`Senha do login ${idLogin} atualizada com sucesso`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === VERIFICAR E-MAIL PARA RECUPERAÇÃO DE SENHA ===
ipcMain.handle('verificar-email-recuperacao', async (event, email) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM login WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return { existe: false };
    }

    return { existe: true, idLogin: rows[0].id };
  } catch (err) {
    console.error('Erro ao verificar e-mail:', err);
    return { existe: false, erro: err.message };
  }
});

// === REDEFINIR SENHA (via "esqueci minha senha") ===
ipcMain.handle('redefinir-senha', async (event, dados) => {
  try {
    const { idLogin, novaSenha } = dados;

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await db.promise().query(
      'UPDATE login SET senha = ? WHERE id = ?',
      [novaSenhaHash, idLogin]
    );

    console.log(`Senha do login ${idLogin} redefinida com sucesso`);
    return { sucesso: true };
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === CADASTRAR RECEITA DE MEDICAMENTO CONTROLADO (BALCONISTA) ===
ipcMain.handle('cadastrar-receita-controlada', async (event, dados) => {
  try {
    const {
      cpfCliente, nomeCliente, produtoNome,
      nomeMedico, crm, ufCrm,
      nomePaciente, cpfPaciente,
      tipoReceita, numeroReceita, dataReceita,
      originalConferida, documentoVerificado, observacoes
    } = dados;

    const [result] = await db.promise().query(
      `INSERT INTO receitas_controladas
        (cpf_cliente, nome_cliente, produto_nome, nome_medico, crm, uf_crm,
         nome_paciente, cpf_paciente, tipo_receita, numero_receita, data_receita,
         original_conferida, documento_verificado, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cpfCliente || null, nomeCliente || null, produtoNome,
        nomeMedico, crm, ufCrm,
        nomePaciente, cpfPaciente || null,
        tipoReceita, numeroReceita || null, dataReceita || null,
        originalConferida ? 1 : 0, documentoVerificado ? 1 : 0, observacoes || null
      ]
    );

    console.log('Receita controlada registrada com sucesso!');
    return { sucesso: true, id: result.insertId };
  } catch (err) {
    console.error('Erro ao registrar receita controlada:', err);
    return { sucesso: false, erro: err.message };
  }
});

// === BUSCAR DADOS DA FARMÁCIA (SIDEBAR) ===
ipcMain.handle('buscar-dados-farmacia', async (event, idFarmacia) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM farmacia WHERE id = ?',
      [idFarmacia]
    );

    if (rows.length === 0) return null;

    const farmacia = rows[0];
    if (farmacia.foto_perfil) {
      farmacia.foto_perfil = farmacia.foto_perfil.toString('base64');
    }

    return farmacia;
  } catch (err) {
    console.error('Erro ao buscar dados da farmácia:', err);
    throw err;
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