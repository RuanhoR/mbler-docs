---
layout: home
hero:
  name: "mbler docs"
  text: "docs of github@RuanhoR/mbler"
  tagline: mbler is a build tool in minecraft bedrock (The default language of the document is English)
  actions:
    - theme: brand
      text: start using
      link: /en/start
    - theme: alt
      text: 中文 docs
      link: /zh/index
    - theme: alt
      text: English docs
      link: /en/index
    - theme: alt
      text: visit in GITHUB
      link: https://github.com/RuanhoR/mbler-docs
features:
  - title: i18n Supported
    details: You can set the language according to your preference, with options for English and Chinese.
    link: /en/index
  - title: beta - Unique MCX single-file component for building behavior packs
    details: You can register events and create item entities in a more concise way.
    link: /en/api/mcx
---
#### Introduction
A Node.js package for the Minecraft JavaScript API, making add-on version management easier.

### Installation
Make sure you have the following tools installed:
- Node.js and npm
- Git
```bash
git clone https://gitee.com/n304sc-haoran/mbler.git
cd mbler
npm install
npm link # If it fails, please run bash install.sh
```

After successful installation, you can use it directly:
```bash
# Get version
mbler -v
```
Initialize directory configuration files
```bash
mbler -c <project-path>
mbler init
```
** For details, see: [Documentation](./en/api/index) **

### Publishing Platforms
[GitHub](https://github.com/RuanhoR/mbler)<br>
[Gitee](https://gitee.com/n304sc-haoran/mbler)