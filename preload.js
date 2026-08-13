const { contextBridge, ipcRenderer } = require('electron');

// 暴露少量安全 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  // 原生导出能力（替代浏览器下载）
  saveFileDialog: (defaultName) => ipcRenderer.invoke('save-file-dialog', defaultName),
  writeTextFile: (path, content) => ipcRenderer.invoke('write-text-file', { path, content }),
  getUploadsDir: () => ipcRenderer.invoke('get-uploads-dir'),
  copyExportFile: (src, dest) => ipcRenderer.invoke('copy-export-file', { src, dest })
});
