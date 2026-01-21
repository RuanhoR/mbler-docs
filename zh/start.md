---
layout: home
hero:
  name: mbler 文档
---
# 介绍
一个针对Minecraft JavaScript API 的nodejs包，让你的附加包版本管理更简单
# 安装
推荐使用 GitHub 仓库：
从 [这里](https://github.com/RuanhoR/mbler/releases) 选择版本下载，到达这个目录(使用命令行cd)，运行`npm link`  
也可使用 Gitee 的克隆链接或github镜像站，可能速度更快  
本项目目前迁移`typescript`，你也可以直接运行`tsc`进行构建

安装成功后，你可以直接使用：
```bash
# 获取版本
mbler -v
```
初始化目录配置文件
```bash
mbler -c <项目路径>
mbler init
```  
 详细请看 :  [文档](/zh/api/index) 

### 发布平台
[github](https://github.com/RuanhoR/mbler)  
[gitee](https://gitee.com/n304sc-haoran/mbler)