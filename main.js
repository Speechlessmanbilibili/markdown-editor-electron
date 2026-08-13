const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createApp } = require('./server');

// 数据存储在用户目录（而非 asar 内），跨版本保留
const userDataPath = app.getPath('userData');
const savesDir = path.join(userDataPath, 'saves');
const uploadsDir = path.join(userDataPath, 'uploads');
const publicDir = path.join(__dirname, 'public');

let mainWindow = null;
let serverInstance = null;
const PORT = 3055;

// ---------- 原生导出（IPC） ----------
// 渲染进程通过 electronAPI 调用，用原生「另存为」对话框 + 文件写入/复制，
// 替代浏览器下载机制（Electron 的 window.open 会被拦截、<a download> 不可靠）。
ipcMain.handle('save-file-dialog', async (event, defaultName) => {
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  const result = await dialog.showSaveDialog(win, {
    defaultPath: defaultName || 'document.md'
  });
  if (result.canceled || !result.filePath) return null;
  return result.filePath;
});

ipcMain.handle('write-text-file', async (event, { path: filePath, content }) => {
  await fs.promises.writeFile(filePath, content, 'utf-8');
  return true;
});

ipcMain.handle('get-uploads-dir', async () => uploadsDir);

ipcMain.handle('copy-export-file', async (event, { src, dest }) => {
  await fs.promises.copyFile(src, dest);
  return true;
});

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
