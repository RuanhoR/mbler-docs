# MBLER API

## Usage

### Installation

```bash
npm i mbler --save
```

### Import

Mbler supports module-based imports starting from version `0.2.4-rc.6`:

```javascript
// Main entry
import * as mbler from "mbler";

// Build module entry (recommended) - includes Build, build, watch, etc. build-related APIs
import * as Build from "mbler/build";
```

::: warning Deprecation notice
From version `0.2.4-rc.6`, **do not use** `mbler.Build` or `mbler.default.Build` to access build APIs. These APIs have been moved to the `mbler/build` entry point.

Old usage (deprecated):

```javascript
import * as mbler from "mbler";
mbler.Build; // deprecated
mbler.build; // deprecated
```

New usage (recommended):

```javascript
import * as Build from "mbler/build";
Build.Build; // new Build class
Build.build; // new build function
```

:::

## Overview

### Main entry `mbler`

```javascript
require("mbler");
/* return: {
  LanguageNames: [ 'zh', 'en' ],
  cli: [AsyncFunction: cli],
  cmdList: [...],
  commander: {
    Input: [class Input],
    click: [Function: click],
    onEnd: [Function: onEnd]
  },
  defineConfig: [Function: defineConfig],
  i18n: {},
  templateMblerConfig: {...}
}*/
```

### Build module entry `mbler/build`

Starting from version `0.2.4-rc.6`, a separate build module entry is provided:

```javascript
require("mbler/build");
/* return: {
  default: [class Build],
  Build: [class Build],
  build: [Function: build],
  watch: [Function: watch],
  McxTsc: [Function: McxTsc]
}*/
```

**Use cases:**

- When you only need build functionality without CLI or other features
- Used for encapsulating custom build processes
- Reduces unnecessary dependency imports

# API

## mbler

### mbler cli

Run a CLI service and parse current CLI parameters.

```typescript
function cli(): Promise<void>;
```

**Parameters:** None

**Return Value:**

- `Promise<void>` - CLI execution completed

---

### mbler defineConfig

Define Mbler configuration file type for type hints.

```typescript
function defineConfig(config: MblerConfigData): MblerConfigData;
```

**Parameters:**

- `config: MblerConfigData` - Mbler configuration data

**Return Value:**

- `MblerConfigData` - Returns the passed configuration object

---

### mbler cli

Run a CLI service and parse current CLI parameters
Direct call, no parameters

```typescript
function cli(): Promise<void>;
```

---

## Types

### Types LanguageNames

List of supported language names.

```typescript
const LanguageNames: ["zh", "en"];
```

---

### Types cmdList

Available command list.

```typescript
const cmdList: readonly [
  "c",
  "work",
  "help",
  "h",
  "init",
  "version",
  "build",
  "watch",
  "lang",
  "set-work-dir",
  "publish",
  "unpublish",
  "install",
  "uninstall",
  "login",
  "profile",
  "view",
  "config",
];
```

---

### Types templateMblerConfig

Default configuration template.

```typescript
const templateMblerConfig: MblerConfigData;
```

---

### Types CliParam

CLI parameters interface.

```typescript
interface CliParam {
  params: string[];
  opts: Record<string, string>;
}
```

**Properties:**

- `params: string[]` - Command line argument array
- `opts: Record<string, string>` - Options key-value pairs

---

### Types MblerConfigData

Configuration file data interface.

```typescript
interface MblerConfigData {
  name: string;
  description: string;
  version: string;
  mcVersion: string | string[];
  outdir?: MblerConfigOutdir;
  script?: MblerConfigScript;
  minify?: boolean;
  build?: MblerBuildConfig;
}
```

**Properties:**

- `name: string` - Project name (required)
- `description: string` - Project description (required)
- `version: string` - Project version (required)
- `mcVersion: string | string[]` - Minecraft version (required)
- `outdir?: MblerConfigOutdir` - Output directory configuration
- `script?: MblerConfigScript` - Script configuration
- `minify?: boolean` - Whether to minify code
- `build?: MblerBuildConfig` - Build configuration

---

### Types MblerConfigOutdir

Output directory configuration interface.

```typescript
interface MblerConfigOutdir {
  behavior?: string;
  resources?: string;
  dist: string;
}
```

**Properties:**

- `behavior?: string` - Behavior pack output directory
- `resources?: string` - Resource pack output directory
- `dist: string` - Main output directory (required)

---

### Types MblerConfigScript

Script configuration interface.

```typescript
interface MblerConfigScript {
  main: string;
  ui?: boolean;
  lang?: "ts" | "mcx" | "js";
  UseBeta?: boolean;
}
```

**Properties:**

- `main: string` - Entry file (required)
- `ui?: boolean` - Whether to enable UI
- `lang?: "ts" | "mcx" | "js"` - Script language type
- `UseBeta?: boolean` - Whether to use Beta API

---

### Types MblerBuildConfig

Build configuration interface.

```typescript
interface MblerBuildConfig {
  rollupPlugins?: Plugin[];
  cache?: "auto" | "enable" | "disable";
  bundle?: boolean;
  onEnd?: (config: MblerConfigData) => Promise<void>;
  onStart?: (config: MblerConfigData) => Promise<void>;
  onWarn?: (config: MblerConfigData, warning: Error) => void;
}
```

**Properties:**

- `rollupPlugins?: Plugin[]` - Custom Rollup plugins
- `cache?: "auto" | "enable" | "disable"` - Cache mode
- `bundle?: boolean` - Whether to bundle
- `onEnd?: (config: MblerConfigData) => Promise<void>` - Build completion callback
- `onStart?: (config: MblerConfigData) => Promise<void>` - Build start callback
- `onWarn?: (config: MblerConfigData, warning: Error) => void` - Warning callback

---

### Types ManifestData

Manifest data interface.

```typescript
interface ManifestData {
  format_version: number;
  header: {
    name: string;
    description: string;
    uuid: string;
    version: number[];
    min_engine_version: number[];
  };
  modules: Array<{
    type: "script" | "data" | "resources";
    uuid: string;
    description?: string;
    version: number[];
    language?: string;
    entry?: string;
  }>;
  dependencies?: Array<{
    module_name: string;
    version: string;
  }>;
  subpack?: Array<{
    folder_name: string;
    name: string;
    memory_tier: number;
  }>;
  capabilities?: string[];
}
```

---

## commander

### commander Input

Utility class: Provides console interaction features such as highlighted menu rendering, interactive selection, etc.

```typescript
class Input {
  static render(arr: string[], index: number): string;
  static select<T extends Array<any>>(tip: string, arr: T): Promise<T[number]>;
  static use(
    task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void,
  ): void;
}
```

#### commander Input render

Render menu string with highlighted selected item.

```typescript
static render(arr: string[], index: number): string;
```

**Parameters:**

- `arr: string[]` - Menu options array
- `index: number` - Selected item index

**Return Value:**

- `string` - Rendered menu string

---

#### commander Input select

Interactive menu selection.

```typescript
static select<T extends Array<any>>(tip: string, arr: T): Promise<T[number]>;
```

**Parameters:**

- `tip: string` - Prompt text
- `arr: T` - Options array

**Return Value:**

- `Promise<T[number]>` - Selected result

---

#### commander Input use

Register global key press callback.

```typescript
static use(task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void): void;
```

**Parameters:**

- `task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void` - Callback function

**Return Value:** None

---

### commander click

Wait for a key to be pressed.

```typescript
function click(
  name: string,
  options?: { ctrl?: boolean; alt?: boolean },
): Promise<void>;
```

**Parameters:**

- `name: string` - Key name (required)
- `options?: { ctrl?: boolean; alt?: boolean }` - Key options

**Return Value:**

- `Promise<void>` - Resolves when key is pressed

---

### commander onEnd

Register callback task when process exits.

```typescript
function onEnd(task: () => void): void;
```

**Parameters:**

- `task: () => void` - Callback function to execute on exit

**Return Value:** None

---

## i18n

### i18n default

Default export of the i18n module.

```typescript
interface i18n extends language {
  __internal: {
    class: Lang;
    set: (newLang: "zh" | "en") => void;
  };
}
```

---

### i18n Lang

Language management class.

```typescript
class Lang {
  init(): void;
  set(newLang: "zh" | "en"): void;
  get(): language;
}
```

#### i18n Lang init

Initialize language settings.

```typescript
init(): void;
```

---

#### i18n Lang set

Set current language.

```typescript
set(newLang: "zh" | "en"): void;
```

**Parameters:**

- `newLang: "zh" | "en"` - Language type

---

#### i18n Lang get

Get current language configuration.

```typescript
get(): language;
```

**Return Value:**

- `language` - Current language configuration

---

## Build (mbler/build)

### Build build

Perform a build.

```typescript
function build(cliParam: CliParam, work: string): Promise<number>;
```

**Parameters:**

- `cliParam: CliParam` - CLI parameters object
- `work: string` - Working directory path

**Return Value:**

- `Promise<number>` - Returns status code, 0 indicates success

---

### Build watch

Start watch mode, automatically rebuild when files change.

```typescript
function watch(cliParam: CliParam, work: string): Promise<number>;
```

**Parameters:**

- `cliParam: CliParam` - CLI parameters object
- `work: string` - Working directory path

**Return Value:**

- `Promise<number>` - Returns status code, 0 indicates success

---

### Build Build

Build class, provides more granular build control.

```typescript
class Build {
  currentConfig: MblerConfigData | null;
  srcDirs: { behavior: string; resources: string } | null;
  outdirs: { behavior: string; resources: string; dist: string } | null;
  module: "behavior" | "resources" | "all" | null;
  init: boolean;

  constructor(
    opts: Record<string, string>,
    baseBuildDir: string,
    resolve: (a: number) => void,
    isWatch?: boolean,
  );

  start(): Promise<void>;
  watch(): Promise<null | undefined>;
  getWatchers(): { rollup: any; chokidar: any } | null;
  closeWatchers(): void;
}
```

#### Build Build constructor

```typescript
constructor(
  opts: Record<string, string>,
  baseBuildDir: string,
  resolve: (a: number) => void,
  isWatch?: boolean,
);
```

**Parameters:**

- `opts: Record<string, string>` - Options
- `baseBuildDir: string` - Base build directory
- `resolve: (a: number) => void` - Completion callback
- `isWatch?: boolean` - Whether in watch mode

---

#### Build Build start

Start build.

```typescript
start(): Promise<void>;
```

**Return Value:**

- `Promise<void>` - Build completed

---

#### Build Build watch

Start watch mode.

```typescript
watch(): Promise<null | undefined>;
```

**Return Value:**

- `Promise<null | undefined>`

---

#### Build Build getWatchers

Get watcher handles.

```typescript
getWatchers(): { rollup: any; chokidar: any } | null;
```

**Return Value:**

- `{ rollup: any; chokidar: any } | null` - Watcher handles

---

#### Build Build closeWatchers

Close watchers.

```typescript
closeWatchers(): void;
```

---

### Build McxTsc

MCX TypeScript compiler.

```typescript
class McxTsc {
  constructor();
  transform(code: string, options?: object): string;
}