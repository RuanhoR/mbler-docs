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
  minify: "oxc",
});
```

## Fields

### `name` and `version`

::: tip
`name` and `version` are read from `package.json` in the project root. You do not need to specify them in `mbler.config.js`.
:::

- `name` — The addon package name, must match the pattern `@scope/name` (e.g. `@ruanhor/my-addon`). Used for UUID generation and MNX publishing.
- `displayName` — Optional. A human-readable name displayed in the generated `manifest.json`. If not set, `name` is used instead.
- `version` — The addon version (e.g. `0.0.1-beta`)

```js
export default defineConfig({
  name: "@ruanhor/my-addon",
  displayName: "My Awesome Addon",
  version: "0.0.1",
  // ...
});
```

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

### `outGameOnDev`

Output build results directly into the Minecraft game directory's `development_behavior_packs` and `development_resource_packs`, eliminating manual copying during development.

- Type: `boolean`
- Default: `false`
- When enabled, prompts for the game directory path (reuses the same prompt logic as `mbler install`; the path is cached in global config), and build output goes directly to the game's development pack folders
- When `BUILD_MODULE=release` is set, this option is ignored and the original `outdir` config is used instead (to support release packaging)

```js
outGameOnDev: true,
```

### `manifest`

Full control over the generated `manifest.json`. The section is applied to **both** the behavior pack and the resource pack manifests. A user-supplied `manifest.json` in the pack source folders is still shallow-merged over the generated one (see [Project Structure](./project)).

- Type: `object`

Fields:

- `pack_scope` — Resource pack scope: `'any'` (default), `'world'`, or `'global'`
- `platform_locked` — `boolean`. Forbids using the pack in other players' worlds or servers.
- `base_game_version` — `string`. World template base game version.
- `allow_random_seed` — `boolean`. World template uses a random seed.
- `lock_template_options` — `boolean`. World template locks world options by default.
- `capabilities` — `string[]`. Extra capabilities. Allowed values: `'chemistry'`, `'editorExtension'`, `'experimental_custom_ui'`, `'pbr'`, `'raytraced'`, `'script_eval'`. For packs with scripts, `'script_eval'` is added automatically and user values are merged and deduplicated.
- `dependencies` — Array of dependency objects, appended after the automatically generated Script API dependencies (`@minecraft/server`, plus `@minecraft/server-ui` when `script.ui` is enabled, plus `build.otherDeps`). Two forms are supported:
  - Pack dependency (dependency on another pack by UUID): `{ uuid: string, version: string | number[], name?: string }`
  - Script module dependency: `{ module_name?: string, uuid?: string, version: string }` (the version may be `'beta'` since Minecraft 1.21.120)
- `subpacks` — Array of `{ name, folder_name, memory_tier, memory_performance_tier? }`.
- `settings` — Array of in-game addon setting controls:
  - `{ type: 'label', text? }`
  - `{ type: 'input', text?, name, default? }`
  - `{ type: 'toggle', text?, name, default? }`
  - `{ type: 'slider', text?, name, min?, max?, step?, default? }`
  - `{ type: 'dropdown', text?, name, options?, default? }` — each option is either a plain string or `{ text, name }`
- `metadata` — `{ authors?: string[], license?: string, url?: string, product_type? }`. Setting `product_type: 'addon'` marks the pack as part of an addon (behavior packs then don't disable achievements). `metadata.generated_with` is auto-injected by Mbler as `{ mbler: [version] }` and cannot be overridden.

::: tip
`format_version` is always `2` and not configurable.
:::

In TypeScript configs, the enums `MblerPackScope`, `MblerManifestCapability`, `MblerManifestSettingType` (`'label' | 'input' | 'toggle' | 'slider' | 'dropdown'`) and `MblerManifestProductType` are exported from `mbler`. In plain JavaScript configs, write the plain string values.

```js
manifest: {
  pack_scope: "global",
  platform_locked: false,
  capabilities: ["experimental_custom_ui"],
  dependencies: [
    { uuid: "5c52e969-af53-4def-b6a4-fbc3f34fcb35", version: [1, 0, 0], name: "my-library" },
    { module_name: "@minecraft/server-net", version: "1.0.0-beta" },
  ],
  subpacks: [
    { name: "high", folder_name: "high_res", memory_tier: 4 },
  ],
  settings: [
    { type: "label", text: "Addon settings" },
    { type: "toggle", text: "Enable particles", name: "particles", default: true },
    { type: "slider", text: "Volume", name: "volume", min: 0, max: 100, step: 1, default: 50 },
    { type: "dropdown", text: "Theme", name: "theme", options: ["light", "dark"], default: "light" },
  ],
  metadata: {
    authors: ["Ruanhor"],
    license: "MIT",
    url: "https://github.com/RuanhoR/mbler",
    product_type: "addon",
  },
}
```

### `minify`

Minification engine for bundled script output.

- Type: `'oxc' | 'terser' | 'esbuild' | 'none'`
- Default: `'oxc'` (when the field is omitted)
- Set to a specific engine name (`'oxc'`, `'terser'`, `'esbuild'`) to choose a particular minifier.
- Set to `'none'` to disable script minification entirely — the output stays readable.

### `build`

Advanced build configuration.

::: tip
Script output location is fixed: compiled scripts are always written to the `scripts/` directory inside the behavior pack. The output filename is derived from `script.main` (with the extension normalized to `.js`); for `script.lang: "mcx"` projects it is always `scripts/index.js`. This is not configurable.
:::

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

Additional module names to mark as external (not bundled). Useful when you want to keep certain dependencies outside the bundle.

- Type: `string[]`
- Example: `["@some-org/some-lib"]`

#### `build.cache`

Cache mode for Rolldown builds.

- Type: `"none" | "memory" | "file" | "filesystem" | "auto"`
- Default: `"auto"` (resolves to `"file"` cache)

#### `build.cachePath`

Custom path for the cache file.

- Type: `string`
- Default: `mbler/rolldown.bin` (relative to project root)

#### `build.bundle`

Whether to bundle scripts via Rolldown.

- Type: `boolean`
- Default: `true`
- When `false`, scripts are copied verbatim without bundling

#### `build.clean`

Whether to clean output directories before each build.

- Type: `boolean`
- Default: `true`

#### `build.onStart`

Callback invoked before the build starts.

- Type: `(ctx: MblerConfigData) => void | Promise<void>`

#### `build.onEnd`

Callback invoked after the build completes.

- Type: `(ctx: MblerConfigData) => void | Promise<void>`

#### `build.onWarn`

Callback invoked when a build warning is emitted.

- Type: `(ctx: MblerConfigData, warning: Error) => void | Promise<void>`
