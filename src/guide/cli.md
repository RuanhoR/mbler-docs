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

## `build` Command

Build the project as an mc addon. If `BUILD_MODULE` in the env is `build`, it will additionally generate a package that can be imported into the game.

## `watch` Command

Monitor changes and build in real time. No parameters, depends on the working directory context.

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

- Tip: This command is still in beta.

Usage:

`mbler install @scope/name@version`

If no version, use `latest`

Download a addon from `pmnx. qzz .io`

## `login` command

Tip: This command is still in beta.

Run command and input pmnx token to login pmnx account

## `publish` Command

- Tip: This command is still in beta.

Usage:

`mbler publish -tag :tag_name`

Publish your addon

Params

- `tag`: Set tag name
- `build`: `skip` or `on`, set can exetuce build command

## `unpublish` Command

- Tip: This command is still in beta.

Usage:
`mbler unpublish @scope/name@version`

## `config` Command

Usage:
`mbler config get <key>`  
`mbler config set <key> <value>`  
`mbler config point `  
`mbler config point <new config file point>`

Common Key: token stores pmnx token
