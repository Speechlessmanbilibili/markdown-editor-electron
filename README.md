# 📝 Markdown Editor Pro — 桌面版

基于 Electron 的 Markdown 桌面编辑器，采用 Apple Liquid Glass 设计风格，支持 Word / PDF 导入导出、实时预览、深色/浅色主题。

## ✨ 功能

- **📝 Markdown 编辑** — 分屏实时预览，语法高亮，丰富的格式化工具栏
- **📥 文件导入** — 拖放导入 Word (.docx) / PDF / TXT / Markdown，自动转换
- **📤 多格式导出** — 一键导出 Markdown (.md) / Word (.doc) / PDF
- **🌓 深色/浅色主题** — 带圆形扩散过渡动画，偏好自动记忆
- **💾 自动保存** — 编辑内容自动保存，支持多文档管理
- **📋 大纲导航** — 自动生成文档大纲，点击跳转
- **🔍 查找替换** — Ctrl+F 查找，逐个替换和全部替换
- **⌨️ 快捷键** — `Ctrl+B` 粗体 `Ctrl+I` 斜体 `Ctrl+K` 链接 `Ctrl+S` 保存 `Ctrl+F` 查找
- **💎 液态玻璃设计** — SVG 滤镜驱动的视觉效果，鼠标跟踪视差光球
- **🖥 原生桌面窗口** — 独立窗口，不受浏览器限制

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 16

### 开发运行

```bash
git clone https://github.com/Speechlessmanbilibili/markdown-editor-electron.git
cd markdown-editor-electron
npm install
npm start          # 启动 Electron 开发模式
```

### 编译安装包

```bash
npm run build:win     # Windows (.exe 安装包)
npm run build:linux   # Linux (.tar.gz)
npm run build:mac     # macOS (.dmg，需在 macOS 上运行)
```

### 手动安装 & 使用

下载 [Releases](https://github.com/Speechlessmanbilibili/markdown-editor-electron/releases) 中对应平台的安装包：

- **Windows** — 运行 `Markdown Editor Pro Setup x.x.x.exe` 安装
- **Linux** — 解压 `markdown-editor-electron-x.x.x.tar.gz`，执行 `./markdown-editor-electron`
- **macOS** — 打开 `Markdown Editor Pro-x.x.x.dmg`，拖入 Applications

## 🛠 架构

```
main.js (Electron 主进程)
  ├── 直接引入 server.js → Express 监听 localhost:3055
  └── BrowserWindow → 加载前端页面
```

- Express 服务运行在主进程内（非子进程），兼容 asar 打包
- 数据（保存的文档、上传文件）存储在 `app.getPath('userData')`，不随更新丢失
- `preload.js` 提供安全的 contextBridge，渲染进程无 Node.js 权限

## 📂 项目结构

```
markdown-editor-electron/
├── main.js              # Electron 主进程入口
├── preload.js           # 预加载脚本（contextBridge）
├── server.js            # Express 后端（导出 createApp）
├── package.json
├── public/
│   ├── index.html       # 编辑器主页面（中文界面）
│   ├── css/style.css    # 样式（液态玻璃设计）
│   └── js/
│       ├── app.js       # 前端逻辑
│       └── liquid-glass-fx.js  # SVG 滤镜 + 视差光球
└── dist/                # 构建产物
```

## 📄 许可证

[MIT](LICENSE)
