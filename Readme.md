# assets-3d

assets-3d 是一个基于 Go + React + Three.js 的项目框架，旨在提供对司内资产库的访问，预览，下载，标签与整理
- [项目介绍](https://sofunny.feishu.cn/docx/YaGBd5gFpovgV6xIB0ScEBF8nnh)

## 特性
- 数据增改，通过前端页面提交数字资产的源文件，设置或修改标签，资产以数据单元形式存储在网盘上
- 内容展示，前端以 web 页面形式，按照数据录入的门类，以不同页签的方式整理并显示资源列表图
- 3D 预览，基于每一个数据单元，可以打开渲染窗口，通过摄影机镜头查看数字资产
- 标签检索，搜索框可以根据预设标签，筛选显示指定门类下的资源
- 标签管理，可以新建，修改，删除预设标签，方便对资产数据进行标记，库中资源进行标签的批量修改
- 打包下载，提供将数据单元中所有文件以 .zip 打包方式下载到本地
- 访问记录，能够记录用户的访问类型，访问资源，下载情况等数据
- 权限管理，设置管理员权限，以用于维护后台和数据
- 并发访问，支持多用户同时浏览，下载

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
    git clone git@git.sofunny.io:graphics/game-ripping/assets-3d.git
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
assets-3d/
├── webserver/          # 后端服务
├── public/             # web 工程
├── ├── front-end/      # 前端框架
├── main.go             # 主入口
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进此项目。

## 许可证

此项目基于 [MIT License](LICENSE)。

## 获得本机 ip

1. mac：
    ```bash
    ifconfig getifaddr en0
    ```