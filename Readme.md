# Go01 Framework

Go01 是一个基于 Go 的后端项目框架，旨在提供高效、简洁的开发体验。

## 特性
- 高性能：充分利用 Go 的并发特性。
- 模块化：易于扩展和维护。
- 简单易用：清晰的代码结构和文档支持。

## 安装

在开始之前，请确保已安装 Go。可以通过以下步骤安装：

1. 下载并安装 Go：
    [Go 官方下载页面](https://golang.org/dl/)

2. 验证安装：
    ```bash
    go version
    ```

## React 开发
0. 检查开发环境
    ```
    node -v
    npm -v
    ```
1. 安装 vite, 创建前端开发工程, 选择 javascript + SWC
    ```
    npm create vite@latest
    ```
2. 进入工程，安装与运行，通过 localhost:5173 测试
    ```
    npm install
    npm run dev
    ```

## 部署到后端
1. build 成静态
    ```
    npm run build
    ```
2. 清空 webserver 下 public 文件夹中的内容，将前端工程下的 public 内容复制过去
    ```
    rm -rf ../public/*
    cp -r dist/* ../public/
    ```

## 快速开始

1. 克隆项目：
    ```bash
    git clone https://github.com/your-repo/go01.git
    cd go01
    ```

2. 安装依赖：
    ```bash
    npm install three @react-three/fiber @react-three/drei
    npm install react-router-dom
    ```

3. 运行项目：
    ```bash
    go run main.go
    ```

## 目录结构

```
go01/
├── webserver/          # 后端服务
├── public/             # web 工程
├── ├── front-end/      # 前端框架
├── main.go             # 主入口
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进此项目。

## 许可证

此项目基于 [MIT License](LICENSE)。