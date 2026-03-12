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