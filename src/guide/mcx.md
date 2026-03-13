# mcx DSL in Mbler
## Introduction
mcx is a Vue-like DSL in Mbler designed for easier writing. It has only just started for two months, and many features are incomplete. The following are unfinished parts:
 - vscode syntax highlighting and formatting plugin
 - importing mcx in ts has no types (planning to implement with volar, which is a bit complicated (volar dynamically modifies TypeScript code))
 - Component MCX

## Usage

Create a project with `mbler init` (if mbler is not installed, go to [Getting Started](./quick-start)) and choose mcx as the language. 
Then, a template package will be generated automatically, and you can try to modify some things.

## Detailed Overview

MCX is currently divided into the following kinds:
 - UI MCX
 - Event MCX
 - App MCX
 - Component MCX

### UI MCX
Example:
```
<Ui>
  <button click="hello">{{ title }}</button>
</Ui>
<script>
  export const hello = function() {
    console.log("Hello world")
  }
</script>
```
Usage in other files:
```javascript
import UI from "./ui.mcx"
import { system, world } from "@minecraft/server"

system.run(()=>{
  const players = world.getPlayers();
  UI.app.ui.show(players[0], {
    title: "TEST"
  })
})
```
### Event MCCX

Example:
```
<Event @after tick="50">
  EntityHitEntity = hit
</Event>
<script>
export function hit(event) {
  console.log(event)
}
</script>
```

External usage (best imported in App Mcx):
```
<script>
import event from "./event.mcx";
event.subscribe() // register all, or event.subscribe("EntityHitEntity")
</script>
```
### Component MCX
No need to think about this one yet, it is still in the planning stage