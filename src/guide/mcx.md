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

`@mbler/mcx-component` exports the following component classes(need install):

```javascript
import {
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  ComponentType,
} from "@mbler/mcx-component";
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

Build in-game forms with two modes:

- **`<Ui>`** — CustomForm (reactive, Observable bindings). Requires `@minecraft/server-ui` >= 2.1.
- **`<Form>`** — Legacy FormData (ModalFormData / ActionFormData / MessageFormData). Works on any version.

#### Available Tags

Tags map to the underlying Minecraft form API methods:

| Tag | `<Ui>` (CustomForm) | `<Form type="modal">` (ModalFormData) | `<Form type="action">` (ActionFormData) | `<Form type="message">` (MessageFormData) |
|-----|---------------------|---------------------------------------|----------------------------------------|------------------------------------------|
| `title` | constructor arg | `.title()` | `.title()` | `.title()` |
| `label` | `.label()` | `.label()` | `.label()` | — |
| `header` | `.header()` | `.header()` | `.header()` | — |
| `body` | — | `.label()` | `.body()` | `.body()` |
| `divider` | `.divider()` | `.divider()` | `.divider()` | — |
| `spacer` | `.spacer()` | — | — | — |
| `close-button` | `.closeButton()` | — | — | — |
| `input` / `textField` | `.textField()` | `.textField()` | — | — |
| `toggle` | `.toggle()` | `.toggle()` | — | — |
| `dropdown` | `.dropdown()` | `.dropdown()` | — | — |
| `slider` | `.slider()` | `.slider()` | — | — |
| `submit` | — | `.submitButton()` | — | — |
| `button` | `.button()` | — | `.button()` | — |
| `button-m` | — | — | — | `.button1()` / `.button2()` |

#### Legacy Form (non-reactive)

```
<Form>
  <title>Hello</title>
  <label>Welcome, {{ playerName }}!</label>
  <button click="close">Close</button>
</Form>
<script>
  export const prop = ["playerName"];
  export function close() { /* close */ }
</script>
```

#### CustomForm with Setup Mode (reactive)

```
<Ui setup>
  <title>Settings</title>
  <input>{{ name }}</input>
  <toggle>{{ enabled }}</toggle>
  <button click="save">Save</button>
</Ui>
<script>
import { onStartup, onMounted } from "@mbler/mcx";

const name = defineProp("Player")
const enabled = defineProp(true)

onStartup(() => { /* runs once before first show */ })
onMounted(() => { /* runs every show */ })

function save() { /* name.value gets current value */ }
</script>
```

#### Explicit Form Type

Override the automatic form type detection by adding `type`:

```
<Ui type="action">
  <button click="hello">{{ title }}</button>
</Ui>

<Form type="modal">
  <input>{{ name }}</input>
</Form>
```

Supported types: `modal`, `action`, `message`.

#### For Loops

Iterate over arrays with `in` or `of`:

```
<Ui setup>
  <input for="item in items">{{ item }}</input>
</Ui>
<script>
const items = ["A", "B", "C"]
</script>
```

#### Usage in other files

```javascript
import UI from "./ui.mcx";
import { showForm } from "@mbler/mcx";
import { system, world } from "@minecraft/server";

system.run(() => {
  const players = world.getPlayers();
  showForm(UI, players[0], {
    title: "TEST",
  });
});
```

### Event MCX

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
<script>
import { ItemComponent } from "@mbler/mcx-component"
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

For component exports from @mbler/mcx-core, see [MCX Core API Reference](./internal/mcx)

### App MCX

The App MCX is the **entry point** of your addon. It orchestrates event MCX files and runs setup logic when the addon mounts.

Example:

```
<script>
import event from "./event.mcx";

export default {
  app: {
    event: [event]
  },
  setup(ctx) {
    console.log("Addon mounted!", ctx);
  }
}
</script>
```

The compiled output is consumed by `createApp` from `@mbler/mcx`:

```javascript
import { createApp } from "@mbler/mcx";
import { world } from "@minecraft/server";
import app from "./app.mcx";

const myApp = createApp(app);
myApp.mount(world);
```

**How it works:**

1. The app MCX imports one or more event MCX files
2. `createApp(app)` creates an `App` instance
3. `app.mount(world)` loads all imported event MCX files as `Event` objects, passes them into `ctx.event`, then calls `setup(ctx)`
4. Inside `setup`, you can call `event.subscribe()` to register all event handlers

**Structure of an App MCX:**

- Must export a **default object** with:
  - `app.event` — an array of compiled event MCX modules
  - `setup(ctx)` — called after events are initialized, receives an `MCXCtx` with `{ event: Event[] }`

For the runtime API, see [Runtime Framework API](./internal/runtime).
