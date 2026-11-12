# MCX Compiler Plugins (`mcxPlugin`)

The MCX compiler can be extended without patching `@mbler/mcx-core`. A plugin is a plain object with a `name` and a set of hooks; it receives every `.mcx` file right before and right after the built-in transform, and can rewrite the generated module, register new root tags, or emit extra files (resource packs, JSON UI documents, generated assets…).

```js
// mbler.config.js
import { defineConfig } from "mbler";
import jsonui from "@mbler/mcx-plugin-jsonui";

export default defineConfig({
  description: "demo",
  mcVersion: "1.21.120",
  script: { lang: "mcx", main: "index.ts" },
  mcxPlugin: [jsonui()],
});
```

::: tip
`mcxPlugin` only runs for `script.lang: "mcx"`. With `lang: "ts"` / `"js"` the field is ignored.
:::

## Plugin shape

```ts
import type { McxPlugin } from "@mbler/mcx-core";

const myPlugin: McxPlugin = {
  name: "my-plugin", // required, unique-ish, used in error messages
  tags: {}, // custom root tag handlers
  onTransform, // before the built-in transform
  onTransformed, // after the built-in transform
  onThrow, // recover from compiler errors
  onBuildStart, // build lifecycle
  onBuildEnd,
};
```

| Hook                                     | When                                           | Return value                                       |
| ---------------------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| `tags[name](node, ctx)`                  | a root tag matches `name`                      | `string` = replace the whole module output         |
| `onTransform(ctx)`                       | before the built-in transform                  | `string` = short-circuit the built-in compiler     |
| `onTransformed(code, ctx)`               | after the built-in transform                   | `string` = replace the current code                |
| `onThrow(error, ctx)`                    | compile or transform threw                     | `string` = recover, use it as the module output    |
| `onBuildStart()` / `onBuildEnd()`        | before / after a whole build (not per file)    | —                                                  |

All hooks may be async.

## The hook context

Every hook receives (or can reach through `ctx`) the same per-file context:

| Field                        | Description                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| `id`                         | Absolute path of the `.mcx` file                                             |
| `source`                     | Raw `.mcx` source, always available (even for files without `<script>`)      |
| `code`                       | Current generated JS — source before the transform, compiled JS after        |
| `nodes`                      | Root tag nodes of this file (`name`, `arr`, `content`, `loc`)                |
| `opt`                        | The `CompileOpt` handed to the compiler                                     |
| `output`                     | `{ dist, behavior, resources }` — output directories                        |
| `plugins`                    | Resolved plugin list, in execution order                                    |
| `tag(name)` / `tags(name)`   | First / all root tags with that name                                        |
| `registerTag(name, handler)` | Register a root tag handler for this file                                   |
| `addImport(code)`            | Prepend an import statement to the module                                   |
| `addStatement(code)`         | Append a top-level statement to the module                                  |
| `addExport(name, expr)`      | Add or replace a field on the default export object                         |
| `setType(type)`              | Override the `type` field of the default export                             |
| `error(message, loc?)`       | Throw through the bundler with a mapped location                            |

## Custom root tags

`tags` (or `ctx.registerTag`) lets a plugin claim root tags the built-in compiler does not know. This is how `<JsonUi>` in `@mbler/mcx-plugin-jsonui` works:

```ts
import { defineMcxPlugin } from "@mbler/mcx-core";

export default defineMcxPlugin({
  name: "layout",
  tags: {
    Layout(node, ctx) {
      // node.arr holds the attributes, node.content the children
      ctx.addImport(`import { render } from "my-layout-runtime";`);
      ctx.addExport("layout", JSON.stringify(node.arr));
      ctx.setType("layout");
    },
  },
});
```

```xml
<Layout size="[100, 50]" />
```

compiles to a module whose default export carries `type: "layout"` and a `layout` field, plus the injected import. The generated object can be passed straight into `<Component>` or any runtime that consumes MCX modules.

A tag handler may also `return` a string to replace the entire module — useful when the tag is the whole file.

::: tip
Root tags claimed by a plugin are simply ignored by the built-in transform, so `<Panel>` / `<Layout>` / `<JsonUi>` can live next to `<script>` in the same file. Only the tags listed in the built-in `<Ui>` / `<Form>` tables keep their original behaviour.
:::

## Replacing the compile output

`onTransform` runs before the built-in `<App>` / `<Ui>` / `<Form>` / `<Event>` / `<Component>` handling. Returning a string skips the built-in transform completely:

```ts
onTransform(ctx) {
  const ui = ctx.tag("Ui");
  if (!ui) return; // not mine, let the built-in transform run
  return generateModule(ui, ctx); // replace everything
}
```

Note that `ctx.source` is available even for files the compiler rejects (for example a `.mcx` with no `<script>`), so `onThrow` can parse the source itself and recover:

```ts
onThrow(error, ctx) {
  if (!/must has a script/i.test(error.message)) return;
  return compileFromSource(ctx.source);
}
```

`onTransformed` runs on the final JS and chains across plugins, so several plugins can post-process the same module.

## Ordering

Plugins run in the order they appear in the array — `[a(), b()]` runs `a` before `b` for every hook. `onTransform` stops at the first plugin returning a string, while `onTransformed` runs for every plugin.

Both of these are accepted:

```js
mcxPlugin: jsonui(),                  // single plugin
mcxPlugin: [jsonui(), myPlugin],      // factory call + plain object
```

A plugin returned from a factory keeps its own state, so calling `jsonui()` per addon gives each addon an independent build state.

## Build lifecycle

`onBuildStart` / `onBuildEnd` are forwarded by the Rolldown plugin used by `mbler`, and by `vitePlugin` for tests:

- `onBuildStart` — clear caches, reset counters;
- `onBuildEnd` — flush aggregated files (that is where the JSON UI plugin writes `ui/_ui_defs.json`).

## Using plugins in tests

`vitePlugin` accepts the same `mcxPlugin` field, so unit tests can compile `.mcx` files with plugins enabled:

```ts
// vitest.config.ts
import ts from "typescript";
import { defineConfig } from "vitest/config";
import { vitePlugin } from "@mbler/mcx-core";
import jsonui from "@mbler/mcx-plugin-jsonui";

export default defineConfig({
  plugins: [
    vitePlugin(
      {
        moduleDir: "behavior/modules",
        tsconfigPath: "tsconfig.json",
        sourcemap: false,
        ts,
        mcxPlugin: [jsonui()],
      },
      { dist: ".mcx-out", behavior: ".mcx-out", resources: ".mcx-out" },
    ),
  ],
});
```

## Official plugins

| Package                                                     | What it does                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| [`@mbler/mcx-plugin-jsonui`](./jsonui)                      | Compiles `<Ui type="jsonui">` into JSON UI resource files            |

See [JSON UI Plugin](./jsonui) for the full attribute and availability reference.
