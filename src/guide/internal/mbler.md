# Mbler API

## Installation

```bash
npm install mbler
```

## Import

Starting from version `0.2.4-rc.6`, Mbler supports modular imports:

```javascript
// Main entry
import * as mbler from "mbler";

// Build module entry (recommended) - contains Build, build, watch and other build-related APIs
import * as Build from "mbler/build";
```

::: warning Deprecation Notice
Starting from version `0.2.4-rc.6`, using `mbler.Build` or `mbler.default.Build` to access build APIs is **not recommended**. These APIs have been moved to the `mbler/build` entry point.

Deprecated (old):
```javascript
import * as mbler from "mbler";
mbler.Build // deprecated
mbler.build // deprecated
```

Recommended (new):
```javascript
import * as Build from "mbler/build";
Build.Build   // new Build class
Build.build  // new build function
```
:::

## Overview

### Main Entry `mbler`

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

### Build Module Entry `mbler/build`

Starting from version `0.2.4-rc.6`, a separate build module entry is provided:

```javascript
require("mbler/build");
/* return: {
  default: [class Build],
  Build: [class Build],
  build: [Function: build],
  watch: [Function: watch],
  McxTsc: [Function: McxTsc],
  Sapi: [Module],
  BuildCacheManager: [class BuildCacheManager],
  Progress: [class Progress]
  generateRelease: [Function: generateRelease],
  terserPlugin: [Function: terserPlugin],
  esbuildPlugin: [Function: esbuildPlugin],
}*/
```

**Use Cases:**
- When you only need build functionality without CLI or other features
- For encapsulating custom build workflows
- To reduce unnecessary dependency imports

# API

## mbler

### mbler#cli

Run a CLI service, parse current CLI arguments.

```typescript
function cli(): Promise<void>;
```

**Parameters:** None

**Return Value:**
- `Promise<void>` - CLI execution complete

---

### mbler#defineConfig

Define Mbler configuration file type for type hints.

```typescript
function defineConfig(config: MblerConfigData): MblerConfigData;
```

**Parameters:**
- `config: MblerConfigData` - Mbler configuration data

**Return Value:**
- `MblerConfigData` - Returns the passed configuration object

---

## Types

### Types#LanguageNames

Supported language names list.

```typescript
const LanguageNames: ["zh", "en"];
```

---

### Types#cmdList

Available command list.

```typescript
const cmdList: readonly [
  "c", "work", "help", "h", "init", "version",
  "build", "watch", "lang", "set-work-dir",
  "publish", "unpublish", "install", "uninstall",
  "login", "profile", "view", "config", "log"
];
```

---

### Types#templateMblerConfig

Default configuration template.

```typescript
const templateMblerConfig: MblerConfigData;
```

---

### Types#CliParam

CLI parameter interface.

```typescript
interface CliParam {
  params: string[];
  opts: Record<string, string>;
}
```

**Properties:**
- `params: string[]` - Command line parameter array
- `opts: Record<string, string>` - Options key-value pairs

---

### Types#MblerConfigData

Configuration file data interface.

```typescript
interface MblerConfigData {
  name: string;
  displayName?: string;
  description: string;
  version: string;
  mcVersion: string;
  outdir?: MblerConfigOutdir;
  script?: MblerConfigScript;
  minify?: 'oxc' | 'terser' | 'esbuild';
  build?: Partial<MblerBuildConfig>;
}
```

**Properties:**
- `name: string` - Package name (required), used for UUID generation and MNX publishing
- `displayName?: string` - Optional display name shown in manifest.json; falls back to `name` if not set
- `description: string` - Project description (required)
- `version: string` - Project version (required)
- `mcVersion: string` - Minecraft version (required)
- `outdir?: MblerConfigOutdir` - Output directory configuration
- `script?: MblerConfigScript` - Script configuration
- `minify?: 'oxc' | 'terser' | 'esbuild'` - Minification engine (default: 'oxc')
- `build?: Partial<MblerBuildConfig>` - Build configuration

---

### Types#MblerConfigOutdir

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

### Types#MblerConfigScript

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

### Types#MblerBuildConfig

Build configuration interface.

```typescript
interface MblerBuildConfig {
  rollupPlugins: Plugin[];
  rollupExternal: string[];
  cache: 'none' | 'memory' | 'file' | 'filesystem' | 'auto';
  cachePath: string;
  bundle: boolean;
  clean?: boolean;
  outputDir: string;
  outputFilename: string;
  onEnd: (ctx: MblerConfigData) => void | Promise<void>;
  onStart: (ctx: MblerConfigData) => void | Promise<void>;
  onWarn: (ctx: MblerConfigData, warning: Error) => void | Promise<void>;
}
```

**Properties:**
- `rollupPlugins: Plugin[]` - Custom Rollup plugins
- `rollupExternal: string[]` - Additional external modules
- `cache: 'none' | 'memory' | 'file' | 'filesystem' | 'auto'` - Cache mode
- `cachePath: string` - Cache file path
- `bundle: boolean` - Whether to bundle scripts via Rollup (default: true)
- `clean?: boolean` - Clean output dirs before build (default: true)
- `outputDir: string` - Output subdirectory (default: 'scripts')
- `outputFilename: string` - Force output filename
- `onEnd: (ctx: MblerConfigData) => void | Promise<void>` - Build complete callback
- `onStart: (ctx: MblerConfigData) => void | Promise<void>` - Build start callback
- `onWarn: (ctx: MblerConfigData, warning: Error) => void | Promise<void>` - Warning callback

---

### Types#ManifestData

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

### commander#Input

Utility class: Provides console interaction features like highlighted menu rendering, interactive selection, etc.

```typescript
class Input {
  static render(arr: string[], index: number): string;
  static select<T extends Array<any>>(tip: string, arr: T): Promise<T[number]>;
  static use(task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void): void;
}
```

#### commander#Input#render

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

#### commander#Input#select

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

#### commander#Input#use

Register global key press callback.

```typescript
static use(task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void): void;
```

**Parameters:**
- `task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void` - Callback function

**Return Value:** None

---

### commander#click

Wait for a specific key to be pressed.

```typescript
function click(
  name: string,
  options?: { ctrl?: boolean; alt?: boolean }
): Promise<void>;
```

**Parameters:**
- `name: string` - Key name (required)
- `options?: { ctrl?: boolean; alt?: boolean }` - Key options

**Return Value:**
- `Promise<void>` - Resolves when key is pressed

---

### commander#onEnd

Register callback tasks when process exits.

```typescript
function onEnd(task: () => void): void;
```

**Parameters:**
- `task: () => void` - Callback function to execute on exit

**Return Value:** None

---

## i18n

### i18n#default

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

### i18n#Lang

Language management class.

```typescript
class Lang {
  currentLang: "zh" | "en";
  init(): void;
  set(newLang: "zh" | "en"): boolean;
  get(): language;
}
```

#### i18n#Lang#init

Initialize language settings (reads from `~/.cache/mbler/lang.db`).

```typescript
init(): void;
```

---

#### i18n#Lang#set

Set current language.

```typescript
set(newLang: "zh" | "en"): boolean;
```

**Parameters:**
- `newLang: "zh" | "en"` - Language type

**Return Value:**
- `boolean` - Whether setting succeeded

---

#### i18n#Lang#get

Get current language configuration.

```typescript
get(): language;
```

**Return Value:**
- `language` - Current language configuration

---

## Logger

Logger writes to `~/.cache/mbler/latest.log`.

```typescript
class Logger {
  static i(tag: string, msg: string): void;  // INFO
  static w(tag: string, msg: string): void;  // WARN
  static e(tag: string, msg: string): void;  // ERROR
  static d(tag: string, msg: string): void;  // DEBUG
  static LogFile: string;                     // Current log file path
}
```

---

## UUID

Deterministic UUID generation.

```typescript
import { fromString } from "mbler"; // or from "mbler/uuid"

function fromString(input: string, salt?: string): string;
```

**Parameters:**
- `input: string` - Input string
- `salt?: string` - Optional salt (defaults to internal salt)

**Return Value:**
- `string` - Deterministic UUID v4

---

## Utilities

Utility functions exported from the main entry.

```typescript
function ReadProjectMblerConfig(project: string): Promise<MblerConfigData>;
function readFileAsJson<T>(filePath: string): Promise<T>;
function writeJSON(filePath: string, data: unknown): Promise<void>;
function showText(text: string, needNextLine?: boolean): void;
function input(tip?: string, show?: boolean): Promise<string>;
function fileExists(file: string): Promise<boolean>;
function findReadme(dir: string): Promise<string | null>;
function join(baseDir: string, inputPath: string): string;
function stringToNumberArray(str: string): [number, number, number];
function compareVersion(a: string, b: string): number;
function isValidVersion(version: string): boolean;
function runCommand(param: string[], cwd: string, stdio: string): Promise<{ code: number | null; data: string }>;
function sleep(time: number): Promise<void>;
```

---

## Build (mbler/build)

### Build#build

Perform a one-time build.

```typescript
function build(cliParam: CliParam, work: string): Promise<number>;
```

**Parameters:**
- `cliParam: CliParam` - CLI parameter object
- `work: string` - Work directory path

**Return Value:**
- `Promise<number>` - Returns status code, 0 indicates success

---

### Build#watch

Start watch mode, automatically rebuild when files change.

```typescript
function watch(cliParam: CliParam, work: string): Promise<number>;
```

**Parameters:**
- `cliParam: CliParam` - CLI parameter object
- `work: string` - Work directory path

**Return Value:**
- `Promise<number>` - Returns status code, 0 indicates success

---

### Build#Build

Build class, provides finer-grained control of building.

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

#### Build#Build#constructor

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
- `isWatch?: boolean` - Watch mode flag

---

#### Build#Build#start

Start building.

```typescript
start(): Promise<void>;
```

**Return Value:**
- `Promise<void>` - Build complete

---

#### Build#Build#watch

Start watch mode.

```typescript
watch(): Promise<null | undefined>;
```

**Return Value:**
- `Promise<null | undefined>`

---

#### Build#Build#getWatchers

Get watcher handles.

```typescript
getWatchers(): { rollup: any; chokidar: any } | null;
```

**Return Value:**
- `{ rollup: any; chokidar: any } | null` - Watcher handles

---

#### Build#Build#closeWatchers

Close watchers.

```typescript
closeWatchers(): void;
```

---

### Build#McxTsc

MCX TypeScript compiler (Volar-based).

```typescript
function McxTsc(tscpath?: string): void;
```

**Parameters:**
- `tscpath?: string` - Path to TypeScript's tsc.js (default: `require.resolve('typescript/lib/tsc')`)

**Description:**
Runs the TypeScript compiler with MCX language support, providing type checking for `.mcx` files and image imports.

---

### Build#Sapi

SAPI version resolver — fetches `@minecraft/server` version map from npm.

```typescript
namespace Sapi {
  function refresh(): Promise<void>;
  function generateVersion(
    module: string,
    mcVersion: string,
    isBeta: boolean,
    withFull: boolean
  ): string;
}
```

---

### Build#BuildCacheManager

Cache manager for incremental builds.

```typescript
class BuildCacheManager {
  constructor(baseDir: string, mode?: string, isWatch?: boolean, cachePath?: string);
  getMode(): string;
  shouldUseIncrementalBuild(): boolean;
}
```

---

### Build#Progress

Progress bar display.

```typescript
class Progress {
  constructor(max: number);
  update(current: number): void;
}
```

---

### Build#terserPlugin

Rollup plugin for terser minification (requires `terser` to be installed in the project).

```typescript
function terserPlugin(baseDir: string): Plugin;
```

---

### Build#esbuildPlugin

Rollup plugin for esbuild minification (requires `esbuild` to be installed in the project).

```typescript
function esbuildPlugin(baseDir: string): Plugin;
```

---

### Build#generateRelease

Zip output directories into `.mcaddon` file.

```typescript
function generateRelease(build: {
  outdirs: { behavior: string; resources: string; dist: string };
  module: 'behavior' | 'resources' | 'all';
}): Promise<void>;
```
