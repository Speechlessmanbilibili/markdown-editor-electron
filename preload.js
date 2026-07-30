const { contextBridge } = require('electron');

// 暴露少量安全 API 到渲染进程（如需要可扩展）
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true
});
