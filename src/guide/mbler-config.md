# mbler.config.js

The `mbler.config.js` file is the configuration file for your Mbler project. It is written as an ES module and placed in the project root directory.

## Basic Structure

```js
import { defineConfig } from "mbler";

export default defineConfig({
  description: "My addon",
  mcVersion: "1.21.100",
  script: {
    lang: "ts",
    main: "index.ts",
  },
  minify: false,
});
```

## Fields

### `name` and `version`

::: tip
`name` and `version` are read from `package.json` in the project root. You do not need to specify them in `mbler.config.js`.
:::

- `name` — The addon name, must match the pattern `@scope/name` (e.g. `@ruanhor/my-addon`)
- `version` — The addon version (e.g. `0.0.1-beta`)

### `description`

**Required.** A short description of the addon. This will be written into the generated `manifest.json`.

- Type: `string`
- Example: `"My first Minecraft addon"`

### `mcVersion`

**Required.** The target Minecraft version. Used to generate the `min_engine_version` field in the manifest and resolve the correct `@minecraft/server` dependency version.

- Type: `string`
- Example: `"1.21.100"`

### `script`

All script-related configuration.

- Type: `object`
- Properties:
  - `main` — Entry script file (relative to `behavior/scripts/`)
  - `lang` — Script language: `"js"`, `"ts"`, or `"mcx"`
  - `ui` — Whether to use `@minecraft/server-ui` (default: `false`)
  - `UseBeta` — Whether to use beta API (default: `false`)

```js
script: {
  lang: "ts",
  main: "index.ts",
  ui: true,
}
```

### `outdir`

Custom output directories. If not set, defaults are:
- `behavior` → `dist/dep`
- `resources` → `dist/res`
- `dist` (release zip) → `dist-pkg`

```js
outdir: {
  behavior: "./dist/behavior_pack",
  resources: "./dist/resource_pack",
  dist: "./dist/release",
}
```

### `minify`

Whether to minify the bundled script output.

- Type: `boolean`
- Default: `false`

### `build`

Advanced build configuration.

```js
build: {
  rollupPlugins: [],
  rollupExternal: ["some-lib"],
  cache: "auto",
  cachePath: "mbler/rolldown.bin",
  bundle: true,
  onStart: (ctx) => { console.log("build started"); },
  onEnd: (ctx) => { console.log("build ended"); },
  onWarn: (ctx, warning) => { console.warn(warning); },
}
```

#### `build.rollupPlugins`

Additional Rolldown plugins to include in the build pipeline.

- Type: `Plugin[]`

#### `build.rollupExternal`

Additional module names to mark as external (not bundled).

- Type: `string[]`

#### `build.cache`

Cache mode for Rolldown builds.

- Type: `"none" | "memory" | "file" | "filesystem" | "auto"`
- Default: `"auto"` (uses file cache)

#### `build.cachePath`

Custom path for the cache file.

- Type: `string`
- Default: `mbler/rolldown.bin` (relative to project root)

#### `build.bundle`

Whether to bundle all code into a single output file (`true`) or use code splitting (`false`).

- Type: `boolean`
- Default: `true`

#### `build.onStart`

Callback invoked before the build starts.

#### `build.onEnd`

Callback invoked after the build completes.

#### `build.onWarn`

Callback invoked when a build warning is emitted.
