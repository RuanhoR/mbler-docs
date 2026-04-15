# Mbler API
---
## Installation

```bash
npm install mbler
```

## Import

```javascript
import * as mbler from "mbler";
```

## Overview

```javascript
require("mbler");
/* return: {
  Build: [Object: null prototype] {
    Build: [class Build],
    build: [Function: build],
    default: [class Build],
    watch: [Function: watch]
  },
  Types: [Object: null prototype] {
    LanguageNames: [ 'zh', 'en' ],
    cmdList: [
      'c',     'work',
      'help',  'h',
      'init',  'version',
      'build', 'watch',
      'lang'
    ],
    templateMblerConfig: {
      name: 'demo',
      description: 'demo',
      version: '0.0.0',
      mcVersion: '1.21.100',
      script: [Object],
      minify: false,
      outdir: [Object]
    }
  },
  cli: [AsyncFunction: cli],
  commander: [Object: null prototype] {
    Input: [class Input],
    click: [Function: click],
    onEnd: [Function: onEnd]
  },
  i18n: [Object: null prototype] {
    default: {}
  }
}*/
```

## API

### CLI

Run a CLI service, parse current CLI arguments
directly call, no parameters

```typescript
function cli(): Promise<void>;
```

## Build

For manual control of internal building APIs, you can use this API to encapsulate your application's handling of building

#### build

For a one-time build, you need parameters

```typescript
function build(cliParam: CliParam, work: string): Promise<number>;
```

**Parameters:**

- `cliParam: CliParam` - CLI parameter object
- `work: string` - Work directory path

**Return Value:**

- `Promise<number>` - Returns a status code, 0 indicates success

#### watch

Start listening mode, automatically rebuild when files change

```typescript
function watch(cliParam: CliParam, work: string): Promise<number>;
```

**Parameters:**

- `cliParam: CliParam` - CLI parameter object
- `work: string` - Work directory path

**Return Value:**

- `Promise<number>` - Returns a status code, 0 indicates success

#### Build Class

Build class, provides finer-grained control of building

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
    isWatch?: boolean
  );

  // Start building
  start(): Promise<void>;

  // Start listening mode
  watch(): Promise<null | undefined>;

  // Get watchers
  getWatchers(): {
    rollup: rollup.RollupWatcher;
    chokidar: ReturnType<typeof watch$1>;
  } | null;

  // Close watchers
  closeWatchers(): void;
}
```

## Types

Type definitions for modules

#### CliParam

CLI parameter interface

```typescript
interface CliParam {
  params: string[];
  opts: Record<string, string>;
}
```

**Parameters:**

- `params` - String array
- `opts` - Object

#### MblerConfigData

Configuration data interface

```typescript
interface MblerConfigData {
  name: string;
  description: string;
  version: string;
  mcVersion: string | string[];
  outdir: { behavior: string; resources: string; dist: string } | null;
  script: { ... }
  minify: boolean;
}
```


This interface defines the structure of the MblerConfigData object. It specifies the properties the data object should have: `name`, `description`, `version`, `mcVersion`, `outdir`, `script`, `minify`.

**Attributes:**

The interface includes a list of attributes, each with a type and a required status.  Here's a breakdown:

*   **`name`**: A string representing the project name.
*   **`description`**: A string providing a description of the project.
*   **`version`**: A string representing the Minecraft version.
*   **`mcVersion`**: A string representing the Minecraft version.
*   **`outdir`**: A string representing the output directory configuration.
*   **`script`**: A string representing the script configuration.
*   **`minify`**: A boolean representing whether to compress the code.

**MblerConfigOutdir Interface:**

This interface defines the structure of the MblerConfigOutdir object.

*   **`behavior`**: A string representing the behavior package output directory.
*   **`resources`**: A string representing the resource output directory.
*   **`dist`**: A string representing the main output directory.

**MblerConfigScript Interface:**

This interface defines the structure of the MblerConfigScript object.

*   **`main`**: A string representing the entry file.
*   **`ui`**: A boolean representing whether the UI is enabled.
*   **`lang`**: A string representing the script language (ts, mcx, js).
*   **`UseBeta`**: A boolean representing whether to use the Beta API.

**ManifestData Interface:**

This interface defines the structure of the ManifestData object.

*   **`format_version`**: A number representing the format version.
*   **`header`**: An object containing the header information.
    *   **`name`**: A string representing the header name.
    *   **`description`**: A string representing the header description.
    *   **`uuid`**: A string representing the UUID.
    *   **`version`**: An array of numbers representing the version.
    *   **`min_engine_version`**: An array of numbers representing the minimum engine version.
*   **`modules`**: An array of objects. Each object represents a module type:
    *   **`type`**: A string representing the module type (script, data, resources).
    *   **`uuid`**: A string representing the module UUID.
    *   **`description`**: A string representing the module description.
    *   **`version`**: A number representing the module version.
    *   **`language`**: A string representing the module language.
    *   **`entry`**: A string representing the entry file.
*   **`dependencies`**: An array of objects. Each object represents a dependency.
    *   **`module_name`**: A string representing the module name.
    *   **`version`**: A number representing the version.
*   **`subpack`**: An array of objects. Each object represents a subpackage.
    *   **`folder_name`**: A string representing the folder name.
    *   **`name`**: A string representing the folder name.
    *   **`memory_tier`**: A number representing the memory tier.
*   **`capabilities`**: An array of strings representing the capabilities of the module