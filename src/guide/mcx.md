# mcx DSL in Mbler
## Introduction
mcx is a Vue-like DSL in Mbler designed for easier writing.

### Completed Features
- **VSCode Extension**: Syntax highlighting, code completion, hover documentation, formatting
- **TypeScript Type Support**: Provided via `@mbler/mcx-language-server` LSP support
- **Component MCX**: Support for Item, Block, Entity component definitions
- **UI MCX**: User interface building
- **Event MCX**: Event handling

### Install @mbler/mcx-core

```bash
npm install @mbler/mcx-core --save
```

### Component API Overview

`@mbler/mcx-core` exports the following component classes:

```javascript
import {
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  ComponentType
} from "@mbler/mcx-core";
```

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
First, create a .mcx file and add the `<Component>` tag inside it.  
Demonstration  
```
<Component>
  <items>
    <item id="demo">itemComponent</item>
  </items>
</Component>
<sctipt>
import { ItemComponent } from "@mbler/mcx-core"
const itemComponent = new ItemComponent({
  format: "1.21.100", // format version
  name: "Demo Item",
  id: "mcx_demo:demo_item"
});
itemComponent.setAllowOffHand(true) // allow to be held in off-hand
export {
  itemComponent
}
</script>
```
Explanation
 - Component
   The root tag for component definition
     - items
       - Declares that JSON for items will be defined here
         - item declares an item to be defined from the script export, the content is the export string, and the attribute id is the file Id
 - Script
   - Must implement the export defined in the Component, otherwise it will throw an error during compilation

For component exports from @mbler/mcx-core, see [MCX Exported Object Analysis](./internal/mcx)