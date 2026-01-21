---
layout: home
hero:
  name: mbler docs
---
# Introduction
A Node.js package for the Minecraft JavaScript API that makes version management of your add-ons easier.

# Installation
Recommended to use the GitHub repository: 
Download a version from [here](https://github.com/RuanhoR/mbler/releases), navigate to this directory (use the command line cd), and run `npm link`. 
You can also use the Gitee clone link or a GitHub mirror site, which might be faster. 
This project has currently migrated to `typescript`, and you can also directly run `npm run build` to build.

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
[github](https://github.com/RuanhoR/mbler)  
[gitee](https://gitee.com/n304sc-haoran/mbler)