# AI食物热量分析系统

AI食物热量分析系统是一个智能化的食物识别与营养分析平台，通过AI技术分析食物图片或描述，提供热量信息、营养成分分析及健康饮食建议。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)


## 功能特性

- **食物图像识别** - 通过上传图片或拍照识别食物种类
- **文字描述分析** - 支持通过文字描述获取食物热量信息
- **营养成分分析** - 提供详细的营养成分和热量数据
- **健康建议推荐** - 基于食物特点提供个性化的健康饮食建议
- **历史记录追踪** - 记录分析历史，便于长期饮食管理
- **响应式设计** - 完美适配桌面、平板和手机设备

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS
- **状态管理**: React Hooks
- **数据库**: LocalStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 环境要求

- Node.js >= 18.0.0 (推荐使用 Node.js >= 20.0.0 以获得最佳 localStorage 支持)
- npm 或 yarn

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd U-Card
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

项目当前使用浏览器 localStorage 进行数据存储，无需额外配置。`src/lib/localStorage.js` 文件仅作为兼容性保留，实际数据操作使用本地存储。

### 4. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 5. 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中。

### 6. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用的UI组件
│   ├── AnalysisResultSection.jsx  # 分析结果展示组件
│   ├── ComparisonSection.jsx      # 对比分析组件
│   ├── FoodUploadSection.jsx      # 食物上传组件
│   └── SuggestionSection.jsx      # 建议展示组件
├── pages/              # 页面组件
│   ├── HomePage.jsx     # 主页
│   └── HistoryPage.jsx  # 历史记录页
├── services/           # 服务模块
│   └── analysisService.js # AI分析服务
├── App.jsx             # 主应用组件
└── index.jsx           # 应用入口文件
```

## 部署

### 部署到静态托管服务

1. 构建生产版本:

```bash
npm run build
```

2. 将 `dist/` 目录中的文件部署到您的静态托管服务（如 Netlify、Vercel、GitHub Pages 等）

### 部署到阿里云ESA

项目已配置为可在阿里云ESA平台部署，配置文件 `esa.jsonc` 定义了部署参数：

- **构建命令**: `npm install`
- **构建输出目录**: `./dist`
- **404处理策略**: 单页应用模式

要部署到阿里云ESA，只需将项目推送到配置的仓库，ESA将自动构建和部署。

### 部署到 Vercel

1. 安装 Vercel CLI:

```bash
npm i -g vercel
```

2. 登录 Vercel:

```bash
vercel login
```

3. 部署项目:

```bash
vercel --prod
```

注意：由于项目使用 localStorage，部署后数据将按浏览器隔离存储。如需共享数据，需配置后端服务。

### 部署到 Netlify

1. 在项目根目录创建 `netlify.toml` 文件:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_VERSION = "18" }
```

2. 使用 Netlify CLI 部署:

```bash
netlify deploy --prod
```

注意：由于项目使用 localStorage，部署后数据将按浏览器隔离存储。如需共享数据，需配置后端服务。

## 数据存储配置

本项目使用浏览器 localStorage 作为数据存储方案。当前配置信息如下：

- **存储方案**: 浏览器 localStorage
- **兼容性**: `src/lib/localStorage.js` 文件仅作为兼容性保留，实际数据操作使用本地存储

如需使用后端服务，请替换 `src/lib/localStorage.js` 中的实现。

## 数据结构

项目当前使用浏览器 localStorage 存储数据：

- 食物分析历史记录 - 存储用户的历史分析记录
- 食物营养数据 - 存储分析得到的营养成分信息

数据存储在 `foodHistory` 键下，采用JSON格式。

## 开发

### 添加新功能

1. 在 `src/pages/` 中创建新页面组件
2. 在 `src/App.jsx` 中添加路由
3. 如需要，创建相应的组件和 Hook

### 自定义样式

样式使用 Tailwind CSS 定义，可以在 `src/index.css` 中添加自定义样式，在 `tailwind.config.js` 中扩展配置。

## 故障排除

### Node.js 版本问题

虽然项目使用 localStorage 而非 localStorage，但某些依赖可能仍需要较新版本的 Node.js。如果遇到构建错误，建议升级到 Node.js 18.0.0 或更高版本。

### 依赖安装问题

如果安装依赖时遇到问题，尝试清理缓存:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 构建错误

如果构建时出现错误，检查控制台输出以定位问题，通常需要检查 JavaScript 语法错误或导入/导出问题。

## 许可证


该项目遵循以下协议 [MIT license](https://opensource.org/licenses/MIT).