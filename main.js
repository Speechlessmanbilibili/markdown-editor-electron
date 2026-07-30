const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow = null;
let serverProcess = null;

// 找一个可用端口
function getPort() {
  // Electron 环境下直接用固定端口即可，一般不会冲突
  return 3055;
}

function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'server.js');
    serverProcess = fork(serverPath, [], {
      env: { ...process.env, ELECTRON_RUN: '1' },
      silent: true
    });

    serverProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      process.stdout.write('[server] ' + msg);
      // 等服务就绪信号
    });

    serverProcess.stderr.on('data', (data) => {
      process.stderr.write('[server] ' + data.toString());
    });

    serverProcess.on('error', reject);

    // 给服务一点时间启动
    setTimeout(resolve, 1500);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Markdown Editor Pro',
    backgroundColor: '#0d0d1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(`http://localhost:${getPort()}`);

  // 外部链接用默认浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});
