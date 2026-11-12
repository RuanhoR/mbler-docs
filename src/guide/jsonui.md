# JSON UI Plugin

`@mbler/mcx-plugin-jsonui` turns `<Ui type="jsonui">` into real [JSON UI](https://mcbeui.netlify.app/) resource files, so a `.mcx` file can patch the vanilla UI — HUD elements, server form screens, or whole custom screens — instead of only building SAPI forms.

The plugin is built on [MCX compiler plugins](./mcx-plugin) and never touches the built-in `<Ui>` / `<Form>` form compiler:

1. `<Ui>` is compiled into a plain JSON UI document (namespace + controls);
2. an **availability adapter** decides where that document is written and how it is hooked into vanilla UI.

Any attribute you put on `<Ui>` (other than the reserved ones below) is written into the JSON UI element verbatim; valid JSON values are coerced to numbers / booleans / arrays / objects, child tags become `controls`, and nested tags become nested controls. That is why no compiler change is needed for new control types.

## Install

```bash
pnpm add -D @mbler/mcx-plugin-jsonui
```

```js
// mbler.config.js
import { defineConfig } from "mbler";
import jsonui from "@mbler/mcx-plugin-jsonui";

export default defineConfig({
  description: "my ui addon",
  mcVersion: "1.21.120",
  script: { lang: "mcx", main: "index.ts" },
  mcxPlugin: [jsonui()],
});
```

`jsonui()` accepts options and can be combined with other compiler plugins:

```js
mcxPlugin: [
  jsonui({ uiDir: "ui", formMarker: "my_ui:" }),
  myOtherPlugin,
];
```

## Writing a screen

```xml
<Ui type="jsonui" target="shop" availability="server_form" namespace="mypack">
  <label text="Shop" size="[80, 20]" />
  <button id="buy" text="Buy" />
  <panel id="row" size="[100, 30]">
    <image texture="textures/ui/icon" />
  </panel>
</Ui>
```

### Root attributes

| Attribute                        | Description                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `type="jsonui"`                  | Enables the plugin (required); a `<JsonUi>` root tag works without `type`        |
| `target`                         | Target screen / control name; optional, derived from the file name when omitted  |
| `availability` / `avail` / `use` | How the document is mounted, default `file`                                     |
| `namespace` / `ns`               | JSON UI namespace, defaults to the `.mcx` file name                              |
| `id`                             | Root control id, defaults to `target` or the namespace                           |
| `element-type` / `control-type`  | Root control `type`, defaults to `screen`                                        |
| `file` / `save`                  | Additionally dump the raw JSON document to this path                             |
| anything else                    | Written to the root control as-is (`size`, `anchor_from`, `bindings`, …)          |

Child tags use their `id` / `name` attribute as the control name and their `type` attribute (or the tag name) as the control type. `:xxx="expr"` keeps the expression as a string, which is convenient for bindings.

## Availabilities

| Name                 | Output                                                                 | target                    | Singleton |
| -------------------- | ---------------------------------------------------------------------- | ------------------------- | --------- |
| `file` (default)     | `ui/<namespace>.json`, registered in `_ui_defs.json`                    | optional                  | no        |
| `server_form`        | `ui/<namespace>_<target>.json` + a shared `ui/server_form.json` router  | optional                  | no        |
| `hud`                | `ui/<namespace>_hud.json`, injects `modifications` into `hud_screen`    | optional (`hud_screen`)   | no        |
| `vanilla`            | `ui/<namespace>_vanilla.json`, children override vanilla elements by id | optional                  | **yes**   |
| `none`               | no file; the document only lives in the compiled module                 | optional                  | no        |

### `server_form`

Uses the "Modifying Server Forms" routing from the Bedrock Wiki (the same model as sapdon): a gated factory is inserted into `main_screen_content` pointing at `@<namespace>.root`, and `long_form` hides the native form by title prefix. On the script side, use `getFormTitle()` as the `ActionFormData` title:

```js
// behavior/scripts/index.ts
import { ActionFormData } from "@minecraft/server-ui";
import shop from "./shop.mcx";

world.afterEvents.itemUse.subscribe(({ source }) => {
  new ActionFormData()
    .title(shop.jsonui.getFormTitle()) // 'mbler_ui:shop' by default
    .body("Pick something")
    .show(source);
});
```

All `server_form` screens share one `ui/server_form.json` router, so adding screens does not duplicate the shell.

### `hud` and `vanilla`

- `hud` patches the HUD screen through a `modifications` entry appended in `onBuildEnd`;
- `vanilla` overrides vanilla controls (e.g. `hud_title`) and is only allowed once per build — the plugin validates this.

### Custom availabilities

```js
import { defineJsonUIAvailability, jsonui } from "@mbler/mcx-plugin-jsonui";

const myScreen = defineJsonUIAvailability({
  name: "my_screen",
  requiresTarget: true, // force `target`
  singleton: false, // true = only one screen may use it
  emit(ctx) {
    const file = `${ctx.uiDir}/${ctx.namespace}.mine.json`;
    return {
      files: [{ path: file, content: ctx.document }],
      uiDefs: [file],
      meta: { path: file, formTitle: `my_ui:${ctx.target}` },
    };
  },
});

export default jsonui({ availabilities: [myScreen] });
```

Plugin options: `availability`, `namespace`, `uiDir` (default `ui`), `formMarker` (default `mbler_ui:`), `saveRaw`, `resourcesDir` (override the output dir) and `availabilities`.

## The compiled module

The generated `.mcx` module exports a descriptor object, the `JSONUIComponent` class and an instance:

```ts
import ui, { JSONUIComponent, jsonui } from "./shop.mcx";

jsonui.document; // the raw JSON UI document
jsonui.getPath(); // 'ui/mypack_shop.json'
jsonui.getControls(); // controls of the root element
jsonui.getFormTitle(); // 'mbler_ui:shop' (server_form only)
```

`JSONUIComponent` is also exported from `@mbler/mcx-plugin-jsonui/component`. It has no Node dependencies, so it can be used in `<Component>` compile-time scripts and in in-game Script API code:

```js
import { ActionFormData } from "@minecraft/server-ui";
import shop from "./shop.mcx";

new ActionFormData().title(shop.jsonui.getFormTitle()).body("...").show(player);
```

## Files without `<script>`

A `.mcx` file may contain only `<Ui type="jsonui">`. The compiler first raises "missing script", the plugin recovers through `onThrow`, parses the source itself and still writes the `.json` file and the module — which keeps pure UI files declarative.

## `_ui_defs.json`

Every generated UI file is merged into `ui/_ui_defs.json` in `onBuildEnd`, preserving entries that already exist, so the plugin coexists with hand-written JSON UI files in the same resource pack.

## Related

- JSON UI documentation: <https://mcbeui.netlify.app/>
- `_ui_defs.json`: <https://mcbeui.netlify.app/document/ui_defs>
- [MCX compiler plugins](./mcx-plugin)
