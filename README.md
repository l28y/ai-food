# AI食物热量分析系统

这是一个AI驱动的食物热量和营养分析工具，允许用户上传食物图片并获取详细的营养分析结果。

## 项目结构

```
src/
├── App.jsx
├── index.jsx
├── index.css
└── pages/
    ├── Home.jsx
    ├── AnalysisResult.jsx
    ├── Compare.jsx
    └── History.jsx
```

## 技术栈

- **前端框架**: React 18
- **路由**: React Router DOM
- **UI组件库**: Ant Design
- **构建工具**: Vite
- **样式**: Tailwind CSS + 自定义样式
- **图标**: Ant Design Icons

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 功能模块

- **首页 (Home)**: 应用主界面，提供食物分析入口
- **分析结果 (AnalysisResult)**: 展示食物热量和营养分析结果
- **对比 (Compare)**: 对比不同食物的营养信息
- **历史记录 (History)**: 查看历史分析记录

## 路由

- `/` - 首页
- `/compare` - 对比页面
- `/history` - 历史记录页面
- `/analysis/:id` - 分析结果详情页面
