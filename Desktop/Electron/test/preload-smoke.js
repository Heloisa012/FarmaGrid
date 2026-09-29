const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.whenReady().then(async () => {
  ipcMain.handle('obter-status-cache', () => ({
    online: true,
    sincronizando: false,
    pendentes: 0,
    comErro: 0
  }));

  const janela = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  try {
    await janela.loadURL('data:text/html,<html><head></head><body></body></html>');
    const resultado = await janela.webContents.executeJavaScript(`({
      loginDisponivel: typeof window.electronAPI?.login === 'function',
      cacheDisponivel: typeof window.electronAPI?.sincronizarCache === 'function',
      cpfValido: window.electronAPI?.validarCPF('529.982.247-25') === true,
      cpfInvalido: window.electronAPI?.validarCPF('111.111.111-11') === false
    })`);

    if (!resultado.loginDisponivel || !resultado.cacheDisponivel || !resultado.cpfValido || !resultado.cpfInvalido) {
      throw new Error(`Falha no preload: ${JSON.stringify(resultado)}`);
    }

    console.log('Preload carregado e electronAPI disponível.');
    app.exit(0);
  } catch (erro) {
    console.error(erro);
    app.exit(1);
  }
});
