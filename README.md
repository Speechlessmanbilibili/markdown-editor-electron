# 📝 Markdown Editor Pro — Electron 桌面版

基于 Electron 的 Markdown 桌面编辑器，支持 Word / PDF 导入导出、实时预览、深色/浅色主题，采用 Apple Liquid Glass 设计风格。

## ✨ 功能

- **📝 Markdown 编辑** — 分屏实时预览，语法高亮，丰富的格式化工具栏
- **📥 文件导入** — 拖放导入 Word (.docx) / PDF / TXT / Markdown，自动转换为 Markdown
- **📤 多格式导出** — 一键导出 Markdown (.md)、Word (.doc)、PDF
- **🌓 深色/浅色主题** — 带圆形扩散过渡动画的主题切换
- **💾 自动保存** — 编辑内容自动保存，支持多文档管理
- **📋 大纲导航** — 自动生成文档大纲，点击跳转
- **🔍 查找替换** — 支持 Ctrl+F 查找、逐个替换和全部替换
- **⌨️ 快捷键** — Ctrl+B 粗体、Ctrl+I 斜体、Ctrl+K 链接、Ctrl+S 保存
- **💎 液态玻璃设计** — SVG 滤镜驱动的视觉效果，鼠标跟踪视差光球
- **🖥 原生桌面体验** — 独立窗口，不受浏览器限制

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 16

### 开发运行

```bash
# 1. 克隆仓库
git clone https://github.com/Speechlessmanbilibili/markdown-editor-electron.git
cd markdown-editor-electron

# 2. 安装依赖
npm install

# 3. 启动 Electron 应用
npm start
```

### 构建安装包

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

构建产物在 `dist/` 目录下。

## 🛠 架构

```
Electron Main Process (main.js)
├── 启动 Express 服务器 (server.js) :3055
└── 创建 BrowserWindow → 加载 http://localhost:3055
```

- 前端（public/）作为渲染进程，通过 HTTP 与本地 Express 服务通信
- preload.js 提供安全的 contextBridge API
- 后端支持 Word (.docx) / PDF → Markdown 转换，Markdown → Word / PDF 导出

## 📂 项目结构

```
markdown-editor-electron/
├── main.js                 # Electron 主进程
├── preload.js              # 预加载脚本
├── server.js               # Express 后端服务
├── package.json
├── public/
│   ├── index.html          # 编辑器主页面
│   ├── css/style.css       # 样式
│   └── js/
│       ├── app.js          # 前端逻辑
│       └── liquid-glass-fx.js  # SVG 滤镜效果
├── saves/                  # 文档保存（本地）
└── dist/                   # 构建产物（打包后）
```

## 📄 许可证

[MIT](LICENSE)
