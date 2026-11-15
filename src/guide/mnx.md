# MNX Marketplace

MNX is a Minecraft Bedrock addon marketplace built on the MCX ecosystem. It allows developers to publish, distribute, and manage their addons through a centralized registry.

## Overview

- **Public Registry** — browse and download community addons at [pmnx.qzz.io](https://pmnx.qzz.io)
- **Version Management** — semantic versioning with release channels (e.g. `latest`, `beta`)
- **Scope-based Publishing** — organized under user/team namespaces (`@scope/name`)
- **Token Authentication** — secure API access for automated publishing via CI/CD

## Publishing Workflow

1. **Build** your addon with `mbler build`
2. **Login** to your MNX account: `mbler login <token>`
3. **Publish**: `mbler publish -tag latest`
4. **Manage** versions through the MNX web interface or CLI

## Package Icon

You can ship an icon with your package. The MNX website uses it in place of the default initial-letter avatar on the package page, in search results, and on the home ranking.

Add an `icon` field to the `package.json` at your project root, pointing at an image **inside the project**:

```json
{
  "name": "@scope/name",
  "version": "0.0.1",
  "icon": "./icon.png"
}
```

Rules:

| Item | Details |
|---|---|
| Format | PNG / JPEG / WebP |
| Size | 256KB max per icon |
| Path | Must be a relative path inside the project; `../` escaping is rejected |
| When it applies | Sent along with `mbler publish`. The icon is **per package**, so the most recent publish wins |

Publishing without an `icon` field works fine — the site simply falls back to the initial-letter avatar. On success the CLI prints a line like `Icon: ./icon.png (12.3 KB)` so you can confirm the icon was included.

```bash
mbler publish -tag latest
# + @scope/name@0.0.1 (latest)
# Icon: ./icon.png (12.3 KB)
```

## Publishing from the Web

You can publish straight from the browser if you would rather not install the CLI. Sign in to your MNX account and open the **Publish** page in the header:

1. Pick a `.mcaddon` file (it is a zip archive)
2. Choose the target scope and fill in the package name
3. The page unzips the package **in your browser** and reads `README` plus the version from `manifest.json`
4. If the package has no README you get a one-time prompt: skip it (an empty README is uploaded) or paste one in yourself
5. Optionally upload an icon (PNG / JPEG / WebP, up to 256KB)
6. Hit publish and the file is uploaded to MNX

Parsing happens entirely in your browser — nothing leaves your machine until you click publish.

> The package name and scope are fixed once submitted; publishing the same name and version again is rejected.

## Installing Packages

Users can install published addons directly:

```bash
mbler install @scope/name@version
```

If no version is specified, the latest is used. The addon is downloaded and extracted into the Minecraft game directory.

To remove an installed addon:

```bash
mbler uninstall @scope/name@version
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `mbler login <token>` | Authenticate with MNX |
| `mbler publish` | Publish your addon |
| `mbler unpublish @scope/name@version` | Remove a published version |
| `mbler view @scope/name` | List available versions |
| `mbler install @scope/name@version` | Install to game directory |
| `mbler uninstall @scope/name@version` | Remove from game directory |
| `mbler profile` | Show logged-in user info |
| `mbler config get token` | View current auth token |

## Links

- [MNX Website](https://pmnx.qzz.io)
- [CLI Reference](/guide/cli)
