const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { createApp } = require('./server');

// 数据存储在用户目录（而非 asar 内），跨版本保留
const userDataPath = app.getPath('userData');
const savesDir = path.join(userDataPath, 'saves');
const uploadsDir = path.join(userDataPath, 'uploads');
const publicDir = path.join(__dirname, 'public');

let mainWindow = null;
let serverInstance = null;
const PORT = 3055;

function startServer() {
  return new Promise((resolve, reject) => {
    const expressApp = createApp({
      publicDir,
      savesDir,
      uploadsDir
    });

    serverInstance = expressApp.listen(PORT, () => {
      console.log(`📝 服务已启动 http://localhost:${PORT}`);
      resolve();
    });

    serverInstance.on('error', (err) => {
      console.error('服务启动失败:', err);
      reject(err);
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Markdown Editor Pro',
    backgroundColor: '#0d0d1a',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 准备好后再显示，避免白屏闪烁
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  await mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startServer();
    await createWindow();
  } catch (err) {
    console.error('启动失败:', err);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverInstance) serverInstance.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverInstance) serverInstance.close();
});
