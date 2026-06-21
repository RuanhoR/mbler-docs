# Get Started with Mbler

## Prerequisites

Mbler requires [Node.js](https://nodejs.org) (v18 or later). If you are on Android, you can use [Termux](https://termux.com) to run Node.js.

## Install

Install Mbler globally via npm or pnpm:

```bash
npm install -g mbler
# or
pnpm install -g mbler
```

Verify the installation:

```
mbler version
```

## Create a Project

```bash
pnpm create mbler
```

Follow the interactive prompts to configure your project. This generates:

- `behavior/` — behavior pack files (scripts, animations, etc.)
- `resources/` — resource pack files (textures, models, sounds, etc.)
- `mbler.config.js` — project configuration
- `package.json` — Node.js project metadata

## Build

```bash
mbler build
```

This bundles your scripts, generates `manifest.json` with deterministic UUIDs, and outputs the addon package. Set `outdir` in `mbler.config.js` to point to your Minecraft behavior/resource pack folders for real-time testing.

## Watch Mode

```bash
mbler watch
```

Rebuilds automatically when source files change — ideal for development.

## What's Next?

- [Learn the MCX DSL](./mcx) — create items, entities, UI, and events
- [Project Structure](./project) — understand the directory layout
- [CLI Reference](./cli) — all available commands
- [mbler.config.js Reference](./mbler-config) — configuration options
- [VS Code Extension](./vscode) — install the language server for syntax highlighting and autocompletion
