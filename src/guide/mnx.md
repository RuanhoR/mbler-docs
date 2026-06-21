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
