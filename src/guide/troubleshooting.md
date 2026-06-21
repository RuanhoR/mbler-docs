# Troubleshooting & FAQ

## Common Issues

### `mbler: command not found`

Mbler is not installed or not in your PATH.

**Solution:**

```bash
npm install -g mbler
```

If you used `pnpm`, ensure the pnpm global bin directory is in your PATH:

```bash
pnpm setup
# then restart your terminal
```

### Build fails with `Cannot find module '@minecraft/server'`

The `@minecraft/server` module is external and should not be installed locally — it is provided by the Minecraft Bedrock engine at runtime. Mbler automatically marks it as external during bundling.

**Solution:** Make sure `mbler.config.js` does not list `@minecraft/server` or `@minecraft/server-ui` in `build.rollupExternal` (they are already handled internally).

### `BUILD_MODULE=release` not set

The `.mcaddon` zip file is only generated when `BUILD_MODULE=release` is set in the environment. The `mbler build` command does not create the zip by default — use `mbler publish` instead, which sets this flag automatically.

**To generate a release zip manually:**

```bash
BUILD_MODULE=release mbler build
```

### Deterministic UUID has changed

Mbler generates UUIDs deterministically from the project name, type, and salt. If you rename your project or change the `name` in `package.json`, the UUIDs will change, which will break existing worlds.

**Solution:** Keep the `name` field stable after releasing your addon.

### Watch mode not detecting file changes

On some systems (e.g., WSL, Docker, network file systems), chokidar may not detect changes reliably.

**Solution:**

1. Make sure you are not using a network drive
2. Try running `mbler build` manually instead
3. On WSL, store your project on the Linux filesystem (not `/mnt/c/`)

### Language server not starting in VS Code

**Solution:**

1. Open the command palette (`Ctrl+Shift+P`)
2. Run `MCX: Restart Language Server`
3. If that fails, check that `@mbler/mcx-server` is installed:
   ```bash
   npm install @mbler/mcx-server --save-dev
   ```

### `mcx-tsc` exits with no output

The MCX TypeScript compiler (`mcx-tsc`) uses Volar under the hood. If it produces no output, there may be a TypeScript configuration issue.

**Solution:** Check that `tsconfig.json` exists in your project root and that it includes your `.mcx` files.

---

## FAQ

### Can I use plain JavaScript instead of TypeScript?

Yes. Set `script.lang: "js"` in `mbler.config.js`.

### Can I use both JS and MCX files?

Yes. MCX files (`.mcx`) are compiled to JavaScript by the `@mbler/mcx-core` Rolldown plugin. You can mix `.ts`, `.js`, and `.mcx` files freely.

### How do I test my addon without publishing?

Set `outdir` in `mbler.config.js` to point directly to your Minecraft Bedrock behavior/resource pack folders:

```js
outdir: {
  behavior: "/path/to/com.mojang/development_behavior_packs/my-addon",
  resources: "/path/to/com.mojang/development_resource_packs/my-addon",
}
```

Then run `mbler build` — the outputs go directly to the game directory.

### Where is the log file?

```bash
mbler log point
# Prints: /home/user/.cache/mbler/latest.log
```

### How do I change the CLI language?

```bash
mbler lang       # show current language
mbler lang zh    # switch to Chinese
mbler lang en    # switch to English
```

### What Minecraft versions are supported?

Mbler supports any Minecraft Bedrock version that uses the Script API (v1.19.50+). Set `mcVersion` in `mbler.config.js` to your target version.

### How do I update mbler?

```bash
npm update -g mbler
```

Check the current version:

```bash
mbler version
```

### Can I use mbler with CI/CD pipelines?

Yes. The `login`, `publish`, and `unpublish` commands are designed for automation. Store your MNX token securely as a CI secret and use:

```bash
mbler login $MNX_TOKEN
mbler publish -tag latest
```

---

## How Mbler Resolves SAPI Versions

When you set `mcVersion: "1.21.100"` in `mbler.config.js`, Mbler needs to find the correct `@minecraft/server` and `@minecraft/server-ui` npm package versions that ship with that Minecraft version. This resolution happens in `src/build/sapi.ts`.

### The Problem

Minecraft Bedrock's Script API (`@minecraft/server`) publishes many versions to npm, each embedding the target Minecraft version in its version string. For example:

```
2.1.0-beta.1.21.100-stable   → Minecraft 1.21.100
2.0.0-beta.1.21.60-stable    → Minecraft 1.21.60
2.5.0-beta.1.21.120-preview  → Minecraft 1.21.120 (preview/beta)
```

The version string format is: `<sapi-version>-<channel>.<embedded-mc-version>-<stability>`.

### Resolution Algorithm

1. **Fetch npm registry**: Mbler fetches all versions of `@minecraft/server` and `@minecraft/server-ui` from `https://registry.npmjs.com`.

2. **Extract MC version**: For each npm version, it extracts the embedded Minecraft version using the regex:
   ```
   /-(?:rc|beta)(?:\.[^-.]+)*?\.((?:\d+\.){2}\d+)/
   ```
   This matches patterns like `beta.1.21.100` and captures `1.21.100`.

3. **Classify releases**: Each entry is classified as either:
   - **Formal (stable)** — version string contains `-stable`
   - **Beta (preview)** — everything else (release candidates, previews, etc.)

4. **Build a version map**: The result is a lookup table mapping each Minecraft version to its latest formal and beta SAPI versions:

   ```json
   {
     "server": {
       "1.21.60": { "formal": "2.0.0-beta.1.21.60-stable", "beta": "" },
       "1.21.100": { "formal": "2.1.0-beta.1.21.100-stable", "beta": "" },
       "1.21.120": { "formal": "", "beta": "2.5.0-beta.1.21.120-preview" }
     }
   }
   ```

5. **Cache**: The map is saved to `~/.mbler/_sapi_version.json` for offline reuse. Call `refresh()` to update.

6. **Lookup** (`generateVersion`):
   - Try **exact match** on `mcVersion` first
   - If no exact match, find the **closest lower version** (e.g., if you request `1.21.110` and only `1.21.100` exists, it falls back to `1.21.100`)
   - If no lower version exists, use the **earliest available** version
   - Returns the formal (stable) version by default, or beta if `isBeta` is set
   - Falls back to the other channel if the requested channel is empty

7. **Version shortening** (`evalVersion`): The returned version is shortened for `manifest.json` dependencies. For example:
   ```
   "2.1.0-beta.1.21.100-stable" → "2.1.0-beta"
   ```
   Only the first two segments of the prerelease tag are kept.

### Debugging SAPI Resolution

To see which version Mbler resolved for your project, run:

```bash
BUILD_MODULE=release mbler build
```

The resolved version appears in the generated `manifest.json` under `dependencies`. You can also check the cache file directly:

```bash
cat ~/.mbler/_sapi_version.json
```
