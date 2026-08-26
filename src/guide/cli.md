# Mbler Command Line Usage

## Module Import Note

Starting from version `0.2.4-rc.6`, Mbler supports modular imports:

```javascript
// Main entry - contains CLI and core types
import * as mbler from "mbler";

// Build module - contains Build, build, watch and other build-related APIs
import * as Build from "mbler/build";
```

## `init` Command

Initialize a project, usage:

```bash
mbler init
```

## `lang` Command

Switch/Query the tool language, usage:

```bash
mbler lang
# Should output: zh or en
mbler lang en
# Should output: en
```

## `version` Command

Query the tool version, usage:

```bash
mbler version
# Output: commit: xxxx version: xxx
mbler version -show commit
# Output: commit: xxx
```

Passing a version argument sets the project version:

```bash
mbler version <x.y.z>
```

This writes the new version back to `package.json` in the project root. Only `package.json` is updated — other configuration files are left untouched.

## `build` Command

Build the project as an mc addon. If `BUILD_MODULE` in the env is `build`, it will additionally generate a package that can be imported into the game.

## `watch` Command

Monitor changes and build in real time. No parameters, depends on the working directory context.

### `--enable-dev-ws`

Starts a WebSocket server that enables in-game live reload. After starting the watcher with this flag:

1. The server listens on `ws://localhost:19145` (default port)
2. In Minecraft, run `/connect ws://localhost:19145` to connect
3. When file changes trigger a rebuild, mbler automatically sends reload commands to all connected game clients

```bash
pnpm dev --enable-dev-ws
```

Options:

- `--dev-ws-port <n>` — Custom WebSocket server port (default: `19145`)

Reload behavior:

| Changed files | Command sent |
|---|---|
| Script files (`.ts`, `.js`, `.mcx`, `.mjs`) | `/reload` |
| Resource/manifest/other files | `/reload all` |

![Enable Dev WS (English)](/static/img-demo-enable-ws-en.png)

You can also enable it statically in `mbler.config.js`:

```js
build: {
  devWs: true,
  // devWsPort: 3000  // optional custom port
}
```

## `set-work-dir` Command

Set work dir manger mode.  
Example

- Use current cwd

```bash
mbler set-work-dir off
```

- Use work dir manger

```bash
mbler set-work-dir on
# set work dir
mbler work ./project
```

## `work` Command

Set work dir, more see `set-work-dir`

## `install` Command

> Beta — subject to change.

Usage:

```bash
mbler install @scope/name@version
```

If no version is specified, the latest version is used.

Downloads an addon from `pmnx.qzz.io` and copies it to the Minecraft game directory (behavior/resource packs).

## `uninstall` Command

> Beta — subject to change.

Usage:

```bash
mbler uninstall @scope/name@version
```

Removes an installed addon from the Minecraft game directory.

## `login` Command

> Beta — subject to change.

Usage:

```bash
mbler login [token]
```

Authenticates with the MNX marketplace. If no token is provided, prompts for input interactively.

## `profile` Command

> Beta — subject to change.

Usage:

```bash
mbler profile
```

Shows the currently logged-in user profile information.

## `publish` Command

> Beta — subject to change.

Usage:

```bash
mbler publish -tag :tag_name
```

Publishes your addon to the MNX marketplace.

Options:

- `-tag` — Version tag (e.g. `latest`, `beta`)
- `-build` — `skip` or `enable` (default: `enable`), whether to run the build before publishing

## `unpublish` Command

> Beta — subject to change.

Usage:

```bash
mbler unpublish @scope/name@version
```

Removes a published version from the MNX marketplace.

## `view` Command

> Beta — subject to change.

Usage:

```bash
mbler view @scope/name
```

Lists all published versions of a package on the MNX marketplace.

## `config` Command

Manages global CLI configuration stored at `~/.config/.mbler.config.global.cli.json`.

Usage:

```bash
mbler config get <key>
mbler config set <key> <value>
mbler config point
mbler config point <new config file path>
```

Common keys:
- `token` — stores the MNX authentication token

## `log` Command

Manages the CLI log file (`~/.cache/mbler/latest.log`).

Usage:

```bash
mbler log point    # Show log file path
mbler log clean    # Clear the log file
```
