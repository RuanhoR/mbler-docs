# Create dependencies (script packages)

Introduction
- This document explains how to create a "dependency package" (script dependency) for MBLER that can be reused by other projects.
- Dependency packages do not have a mandatory project structure, but it is recommended to follow the conventions of this note for compatibility with MBLER tools.
- See the repository's built-in module example: lib/modules/gameLib/ (check out this directory for a practical implementation example).

Preparation
- Familiarize yourself with the process of creating a project: see docs/create-project.md.
- Requires Git for publishing to remote repositories (GitHub/Gitee/GitLab, etc.).
Sketch interactive methods
```bash
# Run at the root of the mbler project
mbler create ./test/des
```
Configuration (recommended mbler.config.json in the repository root)
A legitimate JSON example is given below (note: JSON does not allow comments):

```json
{
"name": "GameLib",
"description": "A sample script dependency package",
"version": "0.0.1",
"mcVersion": [
"1.21.10",
"1.21.100"
],
"type": "scriptsDes",
"script": {
"main": "./src/index.js",
"dependencies": {
"gutils": "inner"
}
}
}
```

Field description
- name: The name of the package (used for identification and reference).
- description: A short description of the package.
- version: version number (semantic version recommendation).
- mcVersion: Supported Minecraft version range (example is an array of lowest and highest versions; The specific analysis is based on the MBLER implementation, see source code or tool behavior).
- type: package type ("scriptsDes" indicates a script dependency package).
- script.main: Entry script (relative to package root), executed in the Minecraft SAPI environment.
- script.dependencies: This dependency is the package it depends on, in the format "<包名>": "<源>". Sources can be:
- "inner": refers to the MBLER built-in module;
- git repository URL (ssh or https);
- Local path (used during development).

About code export formats
- Scripts exported from dependencies should use ES Module style (ESM): export interfaces using export.
- Avoid using CommonJS's module.exports/require, as the Script API expects ESM exports at runtime (based on the current implementation, see the implementation in lib for confirmation).

Recommended minimum project structure
```
your-dependency-repo/
├─ mbler.config.json
├─ package.json # Optional, for development tools/builds
├─ src/
│ └─ index.js # script.main (ESM required)
└─ README.md
```

Local development and commissioning
- When developing locally, you can push this dependency repository to the far end (GitHub/Gitee, etc.) and then bring it in via mbler in the target project:
- Install (pull that dependency from git or a local path to the current project's dependency list):
```bash
mbler install <git-or-local-path>
```
- Reference the dependency in the project (add the dependency to the configuration of the current working directory):
```bash
mbler add <package-name>
```
- If you are only debugging locally, you can also use the local path as a dependency source: mbler install: /path/to/your-dep

released
- Push dependency package code to remote repositories (e.g., GitHub, Gitee, GitLab, etc.).
- After publishing, other users can install your dependencies via the git URL:
```bash
mbler install <git-repo-url>
```
Or in environments that support search by name:
```bash
mbler add <package-name>
```

Frequently Asked Questions and Points to Note
- JSON Format: Ensure mbler.config.json is legitimate JSON (don't write comments in JSON).
- mcVersion array: If using an array to express a version range, make sure that the comma and string are formatted correctly.
- Export format error: If you get "export not found" or module parsing errors during runtime, make sure that the entry file is exported using ESM and the path is correct.
- Dependency Loops: Avoid forming loop dependencies between packages, leading to parsing/loading exceptions.
- Consistency with built-in modules: To maintain compatibility with the examples, refer to the implementation and configuration of lib/modules/gameLib/.

reference
- Example: lib/modules/gameLib/ (repository built-in modules)
- Project initialization and use: docs/create-project.md
- For more in-depth API or behavior explanations, check out the corresponding module implementation in the lib directory.