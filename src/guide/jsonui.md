# JSON UI Plugin

[![npm](https://img.shields.io/npm/v/@mbler/mcx-plugin-jsonui?label=npm)](https://www.npmjs.com/package/@mbler/mcx-plugin-jsonui)

`@mbler/mcx-plugin-jsonui` turns `<Ui type="jsonui">` into real [JSON UI](https://mcbeui.netlify.app/) resource files, so a `.mcx` file can patch the vanilla UI — HUD elements, server form screens, or whole custom screens — instead of only building SAPI forms.

The plugin is built on [MCX compiler plugins](./mcx-plugin) and never touches the built-in `<Ui>` / `<Form>` form compiler:

1. `<Ui>` is compiled into a plain JSON UI document (namespace + controls);
2. an **availability adapter** decides where that document is written and how it is hooked into vanilla UI.

Any attribute you put on `<Ui>` (other than the reserved ones below) is written into the JSON UI element verbatim; valid JSON values are coerced to numbers / booleans / arrays / objects, child tags become `controls`, and nested tags become nested controls. That is why no compiler change is needed for new control types.

## Install

```bash
# 0.0.1 is a preview, install it through the alpha tag
pnpm add -D @mbler/mcx-plugin-jsonui@alpha

# runtime helpers used from <script> (Molang bindings, JSONUIComponent types)
pnpm add @mbler/mcx-component
```

Package: <https://www.npmjs.com/package/@mbler/mcx-plugin-jsonui>

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

Uses the "Modifying Server Forms" routing from the Bedrock Wiki: a gated factory is inserted into `main_screen_content` pointing at `@<namespace>.root`, and `long_form` hides the native form by title prefix. On the script side, use `getFormTitle()` as the `ActionFormData` title:

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

## Preview

The plugin ships a preview server so you can see a screen without launching the game:

```bash
pnpm mcx-plugin-jsonui preview                        # current project → http://127.0.0.1:5174
pnpm mcx-plugin-jsonui preview ./src/ui --port 6000 --host 0.0.0.0
```

| Flag                     | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `-p, --port <port>`      | port to listen on, default `5174`                |
| `-H, --host <host>`      | host to bind, default `127.0.0.1`                |
| `-s, --size <WxH>`       | logical canvas size, default `960x540`           |
| `-w, --watch`            | watch the project and hot reload (default on)    |
| `--no-watch`             | disable the file watcher                         |
| `-o, --open`             | open the browser (default on)                    |
| `--no-open`              | do not open the browser                          |

Every `<Ui type="jsonui">` file in the project shows up in the left tree; clicking one renders the compiled document with the same rules the game uses — anchors, `%` / `px` / `%x` lengths, `stack_panel`, `grid`, `$variables` and `#bindings` — and the page hot reloads when you save a file. Textures are resolved from the resource packs found in the project.

Attribute values that look like JSON but do not parse (`size="[100%,100%]"` without quotes) are listed as warnings: the game drops them too, which usually shows up as a 0×0 control.

### Screenshot API

The same renderer is exposed over HTTP for tooling — CI snapshots, or an agent debugging a layout. Images are computed in-process: no browser, no native image library.

```bash
GET /api/screenshot?id=src/ui/shop.mcx&format=png&scale=2&bg=dark
GET /api/screenshot?id=src/ui/shop.mcx&format=svg
GET /api/screens            # file tree, metadata, warnings
GET /api/screen?id=...      # compiled JSON UI document
```

| Query      | Description                                                          |
| ---------- | -------------------------------------------------------------------- |
| `id`       | screen id (path relative to the project root), defaults to the first |
| `format`   | `png` (default) or `svg`                                             |
| `scale`    | pixel density 0.25–8, default `1`                                     |
| `w`, `h`   | canvas size, defaults to the server canvas                           |
| `bg`       | `dark` (default), `checker` or `transparent`                          |
| `download` | `1` adds a `Content-Disposition` filename                             |

PNG is rasterised by the plugin itself: geometry matches the browser preview exactly, text uses a built-in 5×7 pixel font (Latin; lowercase folds to uppercase, unknown glyphs become a box) and images are drawn as placeholders. Request `format=svg` when you need real font rendering and embedded textures.

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

## Bindings from `<script>` (Molang)

A JSON UI screen is only static markup until its controls are bound to data. `<script>` code in a jsonui file runs inside the generated module, so it can reach `jsonui` and shape the document at load time. Bindings are built with `Molang` from `@mbler/mcx-component`:

```ts
import { Molang } from "@mbler/mcx-component";

// query.get_health / 20 * 100 -> the label text
jsonui.text("hp", Molang.query("get_health").div(20).mul(100));

// show the warning only below 25%
jsonui.visible(
  "low_hp",
  Molang.query("get_health").lt(5),
  "always_when_visible",
);

// explicit binding object
jsonui.bind("title", Molang.bind.view(Molang.variable("#text"), "#label"));
```

`Molang` is a small builder — every operator returns a new expression, so long conditions stay readable:

| Helper | Renders as |
| --- | --- |
| `Molang.query("get_health")` | `query.get_health` |
| `Molang.variable("#text")` / `Molang.variable("$score")` | `#text` / `$score` |
| `Molang.context("hud_title_text_string")` | `context.hud_title_text_string` |
| `Molang.math("clamp", x, 0, 100)` | `math.clamp(x, 0, 100)` |
| `Molang.when(cond, a, b)` | `(cond ? a : b)` |
| `Molang.string("HP: ")` | `'HP: '` |
| `expr.add / sub / mul / div / mod` | `(a + b)` … |
| `expr.gt / gte / lt / lte / eq / neq` | `(a > b)` … |
| `expr.and / or / not / neg` | `(a && b)` … |

Bindings themselves come from `Molang.bind`:

```ts
Molang.bind.view(source, "#text"); // binding_type: 'view'
Molang.bind.global(source, "#visible"); // binding_type: 'global'
Molang.bind.collection(source, "#text", "shop_items"); // inside a collection
Molang.bind.of({ source, target: "#alpha", condition: "always" }); // any field
```

`toJSON()` returns the object JSON UI expects (`binding_type`, `binding_condition`, `source_property_name`, `target_property_name`, …), so it can be pushed into `bindings` directly.

## Runtime control helpers

`JSONUIComponent` (the `jsonui` instance) has helpers for the rest of the document, so a screen is not limited to the controls declared in the template:

| Method | What it does |
| --- | --- |
| `bind(id, binding, { create?, replace? })` / `addBinding(...)` | append one binding (or an array) to a control |
| `setBindings(id, bindings)` / `clearBindings(id)` | replace / remove bindings |
| `text(id, expr)` / `visible(id, expr)` | `#text` and `#visible` shortcuts |
| `addControl(parentId, id, element)` | declare a control at runtime, e.g. rows of a list |
| `removeControl(parentId, id)` | drop a control from its parent |
| `findElement(id)` / `getBindings(id)` | read the document (nested controls included) |

`bind()` throws for an unknown id unless `{ create: true }` is passed, which declares a `panel` with that id — handy when a script builds rows dynamically:

```ts
jsonui.bind("rows", Molang.bind.view("#text", "#text"), { create: true });
for (const item of items) {
  jsonui.addControl("rows", item.id, { type: "label", text: item.name });
}
```

::: tip
The script block shares the module scope with the generated document, so named exports work (`export function open(player) {}`) but `export default` is reserved for the jsonui descriptor — the plugin reports a compile error if you use it.
:::

## Files without `<script>`

A `.mcx` file may contain only `<Ui type="jsonui">`. The compiler first raises "missing script", the plugin recovers through `onThrow`, parses the source itself and still writes the `.json` file and the module — which keeps pure UI files declarative.

## `_ui_defs.json`

Every generated UI file is merged into `ui/_ui_defs.json` in `onBuildEnd`, preserving entries that already exist, so the plugin coexists with hand-written JSON UI files in the same resource pack.

## Related

- JSON UI documentation: <https://mcbeui.netlify.app/>
- `_ui_defs.json`: <https://mcbeui.netlify.app/document/ui_defs>
- [MCX compiler plugins](./mcx-plugin)
