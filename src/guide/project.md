# Project Structure

## What is the project structure of a Mbler project?

```
project
  | resources
    | Original resource JSON (manifest.json will automatically generate required fields, if written it will add settings)
  | behavior
    | Original behavior package resources (manifest.json will automatically generate required fields, if written it will add settings)
    | scripts
      | Main script declared in mbler.config.json
      | *.ts | *.mcx (if script.lang in Mbler Config uses ts or mcx)
  | mbler.config.json (Mbler Config)
  | package.json (usually doesn't need to be changed)
```

Tip: If you create `manifest.json` in behavior or resources, mbler will let them join generated `manifest.json` like:

- Before:
  `/behavior/manifest.json`

```json
{
  "a": "b"
}
```

- After（Demo）:
  `/behavior/manifest.json`

```json
{
  "format_version": 2,
  "header": {
    "name": "@ruanhor/example",
    "description": "demo for mcx",
    "uuid": "3f87bcfc-135c-49c7-8b89-faabf4f146a5",
    "version": [0, 0, 1],
    "min_engine_version": [1, 21, 120]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "189303d5-3a12-4e27-8b89-ac861f1116b3",
      "description": "From Mbler(https://github.com/RuanhoR/mbler). welcome to star and contribute!",
      "version": [0, 0, 1]
    },
    {
      "type": "script",
      "entry": "scripts/index.js",
      "language": "javascript",
      "uuid": "95221dac-04ae-4054-8b89-ccb57c29920e",
      "description": "sapi generate by mbler, weclome to download and star at https://github.com/RuanhoR/mbler",
      "version": [0, 0, 1]
    }
  ],
  "capabilities": ["script_eval"],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "2.4.0-beta"
    },
    {
      "module_name": "@minecraft/server-ui",
      "version": "2.1.0-beta"
    }
  ],
  "a": "b"
}
```
