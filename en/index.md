---
layout: home
hero:
  name: mbler Documentation
  text: github@RuanhoR/mbler Documentation
  tagline: Mbler is a development tool for Minecraft Bedrock Edition add-ons
  actions:
    - theme: brand
      text: start using
      link: /en/start
    - theme: alt
      text: Api
      link: /en/api/index
---

# Introduction
A Node.js package for the Minecraft JavaScript API that makes version management of your add-ons easier.

# Installation
Make sure you have the following tools installed:
- Node.js and npm
- Git
```bash
git clone https://gitee.com/n304sc-haoran/mbler.git
cd mbler
npm install 
npm link 
```

After a successful installation, you can use it directly:
```bash
# Get version
mbler -v
```
Initialize the directory configuration file:
```bash
mbler -c <project_path>
mber init
```  
 For more details, see: [Documentation](/en/api/index) 

# Release Platforms
[github](https://github.com/RuanhoR/mbler)<br>
[gitee](https://gitee.com/n304sc-haoran/mbler)