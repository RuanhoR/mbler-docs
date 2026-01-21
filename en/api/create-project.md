# Create your first Minecraft behavior pack with mbler

## Introduction
- This guide shows how to quickly create and manage a Minecraft Behavior Pack using mbler. The documentation example is based on the test example that comes with the repository, and it is recommended to refer to the test folder for the complete configuration and directory structure.
- Description: The JSON standard does not allow comments, and the JSON example demonstrated in the document has been removed. If you want to keep the instructions during editing, use the README or a separate comment file.

## Pre-front
Recommended to use the GitHub repository: 
Download a version from [here](https://github.com/RuanhoR/mbler/releases), navigate to this directory (use the command line cd), and run `npm link`. 
You can also use the Gitee clone link or a GitHub mirror site, which might be faster. 
This project has currently migrated to `typescript`, and you can also directly run `tsc` to build.

### Creating a Project (Initialization)
- Create a new folder in the directory where you want to create the project, or run the initialization command directly in the current directory.
- Note: The '-c' option is not used to "create" a directory, it is used to toggle/set the working directory of the mbler (i.e. tell the mbler which directory to perform the next operation). Examples of proper usage are given below.

### Switching Working Directory (-c)
Switch the working directory of the mbler to the specified path (relative or absolute path is supported):
```bash
mbler <目标目录路径>-c
```
Example:
```bash
# Switch to the directory myproject already exists
mbler -c ./myproject
```

### Create/Initialize Project (init)
Perform the initialization interaction process in the target working directory:
```bash
mbler init
```
Examples can be used in combination
If you want to initialize the project in a new directory, you can create a directory and switch the working directory before running init:
```bash
mkdir myproject
mbler -c ./myproject
mbler init
```
Or (the traditional way) switch directly to the directory and init:
```bash
mkdir myproject
cd myproject
mbler -c .
mbler init
```
### Configuration Instructions (Example mbler.config.json)
Here's an example (note: JSON without inline comments):

```json
{
"name": "test",
"description": "sample project",
"version": "0.1.1",
"mcVersion": "1.21.100",
"script": {
"ui": true,
"main": "main.js",
"UseBeta": true,
"dependencies": {
"gameLib": "inner"
}
},
"subpack": {
"pack-id": "Name displayed"
},
"minify": true,
"outdir": {
"resources": "/path/to/resources-output",
"behavior": "/path/to/behavior-oitput",
"dist": "./dist/dist.mcaddon"
}
}
```

Field description
- name: The name of the project.
- description: Description.
- version: version number.
- mcVersion: The target Minecraft version (required) for inferring the Script API version.
- script.ui: Whether @minecraft/ui is enabled (and if enabled, contains UI-related logic).
- script.main: The main script entry file (as opposed to the script directory).
- script. UseBeta: Whether the beta script API is enabled.
- script.dependencies: Dependency declarations in the format "<包名>": "<源>". The source can be a git link, a local path, or an "inner" (built-in).
- subpack: The subpack declaration, corresponding to the subpack configuration of the manifest.json, and the subpack content is placed in /subpack<pack-id>/ 。
- minify: whether to compress the output (currently JSON vs. JavaScript).
- Outdir.resources resource package output directory, which can be in-game, 'mbler' will handle the uuid to ensure that it does not conflict the default ./dist/res
- Outdir.Behavior behavior package output directory, default ./dist/dep
- outdir.dist When the terminal variable 'MBLER_BUILD_MODULE' is dist, it will be zipped into a mcaddon file that can be directly imported into the game, and the default is ./dist.mcaddon
## Local npm shortcut commands
- npm run build
The corresponding command 'MBLER_BUILD_MODULE=dist mbler build' uses mbler to package the project, and zip it into mcaddon
- npm run dev
The corresponding command 'mbler dev' uses mbler to repackage when modification is detected, but not mcaddon packaging
- npm run dev-build
The corresponding command 'MBLER_BUILD_MODULE=dev mbler build' uses mbler to package the project, not mcaddon

## About dependencies (install/add/remove)
- Install dependencies from the specified source (e.g. git or local path):
```bash
mbler install <git-or-local-path>
```
- Add a known dependency (package name) to the working directory:
```bash
mbler add <package-name>
```
- Remove dependencies in the working directory:
```bash
mbler remove <package-name>
```

## Create custom dependencies
- To create a dependency package that can be managed by MBLER, see (Creating a dependency) [create-des.md] (link in the repository) for details.

package.json with build instructions
- There will be a package.json in the project directory for npm identification, but you usually don't need to run global npm install when developing locally.
- The build process copies the package.json in the temporary/output directory and performs npm install in that directory (if TypeScript needs to be compiled to install dependencies).
- Since the project needs to organize the project structure before the TypeScript can be compiled correctly, do not run npm install directly in the source directory to build.

## Quick workflow recommendation
1. Use mbler init to create a project skeleton or copy the test sample (execute init in the target working directory).
2. Develop scripts and resources locally (res, scripts, etc.).
3. Run mbler build (or the build command provided by the project) to generate output to outdir.
4. Put the output into Minecraft's behavior/resource pack for testing.

## Project Structure (Example)
```
project
├─ package.json # For npm identification (no need to install npm in the source directory)
├─ mbler.config.json
├─behavior
├── scripts
│ └── *.js | *.json
├── res
│ ├── ... Some MCBE native resource files, such as items entities, etc
└── subpack
└── <pack-id>
└── (Same as the above structure, it needs to be declared in mbler.config.json, subpack native support is not recommended)
├─ resources
├── MCBE native resource package structure, except that it does not need to include manifest.json (automatic configuration/generation)
```
## Other
- If you write json in the 'scripts' folder, you can import the data with 'import {data as xxx} from "relative paths' in js, and MBLER will handle the period relationship (native MC does not support importing json)
## Debugging and FAQs
- JSON comment problem: Do not write comments in the actual JSON file, .jsonc is available in the editor to temporarily comment locally, but the file that is ultimately submitted to mbler must be legitimate JSON.
- Invalid npm link: Verify that you have executed npm link in the repository root directory and that the system PATH contains the global npm bin. You can use 'which mbler' (Linux/macOS) or 'where mbler' (Windows) to confirm whether the link is valid.
- TypeScript compilation failed: The build process will perform npm install and compile in the build directory. If there are missing dependencies or versions don't match locally, check the configuration in mbler.config.json with the dependency version of package.json.
- Runtime error Module not found: Verify that the entry specified in script.main exists and is correctly copied to the output directory during build.

## Extended Reading and Resources
- Example project: The test folder of the repository root directory (refer to its configuration and structure).
- Dependency creation instructions: [Create dependency](./create-des.md)
- To view the source code implementation (API and behavior), please refer to the relevant module or refer to the tutorial in the lib/ directory
# Next Step
[Create dependencies](./create-des.md)