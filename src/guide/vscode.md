# VSCode Extension

MCX provides a VSCode extension to provide a better development experience.

## Installation

### Method 1: Install from VSCode Marketplace

Search for `mcx.language.support` in the VSCode extension marketplace and install it.

### Method 2: Use Mbler Auto-configuration

When you create a project using Mbler, it will automatically configure the language server settings.

## Features

The VSCode extension provides the following features:

- **Syntax Highlighting**: Support for syntax highlighting in mcx files
- **Code Completion**: Automatic completion for mcx tags and attributes
- **Hover Documentation**: Display documentation when hovering over tags or attributes
- **Formatting**: Support for code formatting in mcx files
- **Error Hints**: Display compilation errors and warnings

## Language Server

MCX uses `@mbler/mcx-language-server` as the language server backend.

### Install Language Server

```bash
npm install @mbler/mcx-server --save-dev
```

### Configure TypeScript

Add mcx type support in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@mbler/mcx-language-server"
      }
    ]
  }
}
```

### Use Language Server API

```javascript
import { createMCXLanguagePlugin } from "@mbler/mcx-server";
import * as ts from "typescript";

const languagePlugin = createMCXLanguagePlugin(ts);
```

## TSPlugin

`@mbler/mcx-language-server` also provides a TypeScript plugin to enhance type checking for mcx files.

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