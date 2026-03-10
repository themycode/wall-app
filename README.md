# 壁纸应用 - 微信公众号图片集成

## 项目概述

这个项目是一个壁纸应用，支持从多个数据源获取壁纸图片，包括Pixabay API和微信公众号素材库。

## 数据源配置

应用支持两种数据源：

- Pixabay API：免费的图片API，无需后端服务
- 微信公众号素材库：需要后端服务来处理认证和请求

数据源配置在 `src/services/wallpaper.js` 文件中：

```javascript
// 数据源配置
const DATA_SOURCE = 'pixabay' // 'pixabay' 或 'wechat'
```

## 后端服务

### 启动后端服务

如果你选择使用微信公众号作为数据源，需要启动后端服务：

1. 进入server目录：

```bash
cd server
```

2. 安装依赖：

```bash
npm install
```

3. 启动服务：

```bash
npm start
```

服务将在 <http://localhost:3000> 上运行。

### 配置微信公众号

在 `server/wechat-api.js` 文件中，你需要配置你的微信公众号信息：

```javascript
// 微信公众号配置
const APPID = "你的APPID";
const SECRET = "你的SECRET";
```

你可以在微信公众平台（<https://mp.weixin.qq.com/）获取这些信息。>

## 前端应用

### 配置API地址

在 `src/services/wallpaper.js` 文件中，确保 `WECHAT_API_BASE` 指向你的后端服务地址：

```javascript
// 微信公众号API配置
const WECHAT_API_BASE = 'http://localhost:3000' // 本地后端API地址
```

如果你的后端服务部署在其他地址，请相应地更新这个URL。

### 切换数据源

要切换数据源，只需修改 `src/services/wallpaper.js` 文件中的 `DATA_SOURCE` 变量：

```javascript
// 数据源配置
const DATA_SOURCE = 'wechat' // 'pixabay' 或 'wechat'
```

## 注意事项

1. 微信公众号API有调用频率限制，请合理使用
2. 确保你有权限访问微信公众号的素材库
3. 本地开发时，确保后端服务正常运行
4. 部署到生产环境时，需要将后端服务部署到可访问的服务器上 
