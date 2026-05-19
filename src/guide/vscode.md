# VSCode Extension

MCX provides a VSCode extension to provide a better development experience.

## Installation

### Method 1: Install from VSCode Marketplace

Search for `ruanhor.mcx-vscode-client` in the VSCode extension marketplace and install it.

### Method 2: Use Mbler Auto-configuration

When you create a project using Mbler, it will automatically configure the language server settings.

## Features

The VSCode extension provides the following features:

- **Syntax Highlighting**: Support for syntax highlighting in mcx files
- **Code Completion**: Automatic completion for mcx tags and attributes
- **Hover Documentation**: Display documentation when hovering over tags or attributes
- **Formatting**: Support for code formatting in mcx files
- **Error Hints**: Display compilation errors and warnings
- **Language Server**: Integrated LSP language server
- **TypeScript Support**: Auto-configured TypeScript plugin

---

## Extension Detailed Features

### # Code Completion (Completion Provider)

The extension provides the following completion features:

#### MCX Tag Completion

Triggered when typing `<`, provides the following tags:

- `script` - Script block
- `Event` - Event definition block
- `Component` - Component definition block
- `Ui` - UI definition block
- `items` - Item component definition
- `blocks` - Block component definition
- `entities` - Entity component definition
- `item` - Item definition
- `block` - Block definition
- `entity` - Entity definition

#### Attribute Completion

Triggered when typing inside a tag, provides common attributes:

- `id` - Element unique identifier
- `lang` - Script language (ts/js)
- `@before` - Pre-event hook
- `@after` - Post-event hook

#### Script Block Completion

Provides completions inside `<script>` block:

- **import completion**: `Event`, `createApp`
- **Path completion**: `"./event"`, `"./events"`
- **Minecraft event completion**:
  - `playerJoin` - Player join
  - `playerLeave` - Player leave
  - `playerDie` - Player death
  - `playerRespawn` - Player respawn
  - `blockBreak` - Block break
  - `blockPlace` - Block place
  - `itemUse` - Item use
  - `itemUseOn` - Item use on entity
  - `entityHit` - Entity hit
  - `entityDie` - Entity death
  - `projectileHit` - Projectile hit
  - `weatherChange` - Weather change
  - `timeChange` - Time change
- **Event method completion**: `subscribe`, `unsubscribe`, `useWorld`, `createApp`

---

### # Hover Documentation (Hover Provider)

Displays detailed documentation when hovering over tags or attributes:

#### Tag Documentation

- **`<script>`**: Script block for embedded TypeScript/JavaScript code
  - Attributes: `lang`, `id`, `@before`, `@after`
  - Languages: `ts`, `js`
- **`<Event>`**: Minecraft event handler definition block
  - Attributes: `id`
- **`<Component>`**: Component definition block
  - Attributes: `id`
- **`<Ui>`**: UI definition block
  - Attributes: `id`

#### Attribute Documentation

- **`id`**: Unique identifier for this element
- **`lang`**: Script language specification (`ts` or `js`)
- **`@before`** / **`@after`**: Event hook for executing code before/after main logic

---

### # Formatting (Formatting Provider)

Supports code formatting for `.mcx` files, triggered with `Shift+Alt+F` or command palette.

---

### # Language Server Integration

The extension automatically starts a language server client providing:

- Semantic analysis
- Type checking
- Error diagnostics

#### Commands

- **`mcx.restart.language`**: Restart the language server

In the command palette (Ctrl+Shift+P), type `MCX: Restart Language Server` to restart.

---

### # TypeScript Plugin Integration

The extension automatically detects and configures the TypeScript plugin (`@mbler/mcx-ts-plugin`):

1. Detects VSCode TypeScript extension
2. Automatically activates and configures the plugin
3. Provides type support for `.mcx` files

---

## Language Server

MCX uses `@mbler/mcx-server` as the language server backend.

### Install

```bash
npm install @mbler/mcx-server --save-dev
```

### @mbler/mcx-server API

#### Install

```bash
npm install @mbler/mcx-server --save
```

#### Exports

```javascript
import {
  MCXVirtualCode,
  createMCXLanguagePlugin,
  createMCXVirtualCode,
  type MCXLanguagePlugin
} from "@mbler/mcx-server";
```

| Export                    | Type       | Description                     |
| ------------------------- | ---------- | ------------------------------- |
| `MCXVirtualCode`          | `class`    | MCX virtual code class          |
| `createMCXLanguagePlugin` | `function` | Create MCX language plugin      |
| `createMCXVirtualCode`    | `function` | Create MCX virtual code         |
| `MCXLanguagePlugin`       | `type`     | Language plugin type definition |

#### createMCXLanguagePlugin

Create MCX language plugin for Volar language server.

```typescript
function createMCXLanguagePlugin(
  ts: typeof import("typescript"),
): MCXLanguagePlugin;
```

**Parameters:**

- `ts: typeof import("typescript")` - TypeScript module

**Returns:**

- `MCXLanguagePlugin` - MCX language plugin instance

**Usage Example:**

```typescript
import * as ts from "typescript";
import { createMCXLanguagePlugin } from "@mbler/mcx-server";

const languagePlugin = createMCXLanguagePlugin(ts);
```

#### Run Standalone Language Server

```bash
# Using npx
npx mcx-language-server

# Or install globally first
npm install -g @mbler/mcx-server
mcx-language-server
```

---

## TSPlugin

`@mbler/mcx-ts-plugin` provides a TypeScript plugin to enhance type checking for mcx files.

### Install

```bash
npm install @mbler/mcx-ts-plugin --save-dev
```

### Configure

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@mbler/mcx-ts-plugin"
      }
    ]
  }
}
```
