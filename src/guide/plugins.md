# ESLint and Vitest Plugins

The mbler toolchain ships two official plugins for `.mcx` files — one for linting, one for unit testing:

- **[`@mbler/eslint-plugin-mcx`](https://www.npmjs.com/package/@mbler/eslint-plugin-mcx)** — an ESLint parser + rules that lints `.mcx` files directly
- **[`@mbler/vite-plugin-mcx`](https://www.npmjs.com/package/@mbler/vite-plugin-mcx)** — a Vite/Vitest plugin that lets tests `import` compiled `.mcx` modules

## ESLint Plugin

### Install

```bash
pnpm add -D @mbler/eslint-plugin-mcx
```

### Configuration (flat config)

```js
// eslint.config.js
import mcx from "@mbler/eslint-plugin-mcx";

export default [
  ...yourOtherConfigs,
  mcx.configs.recommended,
];
```

`mcx.configs.recommended` applies to all `**/*.mcx` files and enables:

| Rule | Default | Description |
| --- | --- | --- |
| `mcx/valid-event-binding` | error | `<Event>` bindings must use known `@minecraft/server` world events, and handlers must be exported from `<script>` |

Event names are not hardcoded: at lint time the plugin extracts the `WorldAfterEvents` / `WorldBeforeEvents` property names from the `index.d.ts` of the `@minecraft/server` version **installed in your project**, so the known events always match the version you build against. Results are cached at `<project>/node_modules/.tmp/eslint-plugin-mcx/events-<version>.json` and regenerated when the version changes; if `@minecraft/server` cannot be resolved, the plugin falls back to a bundled list. Bindings are validated against the list matching the tag's `@after` / `@before` scope.
| `mcx/no-duplicate-root-tag` | error | `App` / `Event` / `Ui` / `Form` / `script` may appear only once per file (configurable via `unique`) |
| `mcx/valid-prop-value` | error | prop values that look like JSON objects/arrays must parse as JSON |
| `mcx/require-script-lang` | warn | `<script>` must declare its language (`lang="ts"`) |

### Rule options

- `valid-event-binding`: `{ allowUnknown?: boolean, extraEvents?: string[], ignoreKeys?: string[] }`. `McxExtendsBy` and other `Mcx*` compiler directives are always allowed. Event names are validated against the list matching the tag's `@after`/`@before` scope; without a scope attribute an event from either list is accepted.
- `no-duplicate-root-tag`: `{ unique?: string[] }` (default `['App', 'Event', 'Ui', 'Form', 'script']`).
- `require-script-lang`: `{ allow?: string[] }` (default `['ts']`).

### Manual setup (pick rules yourself)

```js
export default [
  {
    files: ["**/*.mcx"],
    languageOptions: { parser: mcx.parser },
    plugins: { mcx },
    rules: {
      "mcx/valid-event-binding": [
        "error",
        { extraEvents: ["myEvent"], allowUnknown: false },
      ],
    },
  },
];
```

## Vitest Plugin

`@mbler/vite-plugin-mcx` wraps `@mbler/mcx-core`'s `rollupPlugin` without modifying core:

- only `.mcx` modules go through the inner transform, so `.ts` files and images keep using Vite's own esbuild/asset pipeline;
- `resolveId` failures fall through to the host resolver instead of throwing (bare ids still resolve against `moduleDir`);
- the inner compile cache is invalidated when a `.mcx` file changes, so watch mode never serves stale output;
- `buildEnd` side effects (texture JSON generation) are never forwarded.

### Install

```bash
pnpm add -D @mbler/vite-plugin-mcx
```

### Configuration

```ts
// vitest.config.ts
import ts from "typescript";
import { defineConfig } from "vitest/config";
import { mcxPlugin } from "@mbler/vite-plugin-mcx";

export default defineConfig({
  plugins: [
    mcxPlugin(
      {
        moduleDir: "behavior/modules", // where bare ids like @mbler/mcx resolve
        tsconfigPath: "tsconfig.json",
        sourcemap: false,
        ts,
      },
      // output dirs required by mcx-core; use throwaway paths for tests
      { dist: ".mcx-out", behavior: ".mcx-out", resources: ".mcx-out" },
    ),
  ],
  test: {},
});
```

Then import `.mcx` files directly in your tests:

```ts
import event from "./event.mcx";

test("event file compiles", () => {
  expect(event.type).toBe("event");
});
```

### Type declaration

```ts
declare module "*.mcx" {
  const mod: {
    type: string;
    setup?: (...args: unknown[]) => unknown;
    app?: Record<string, unknown>;
  };
  export default mod;
}
```

## Custom Rules

The ESLint plugin attaches the template AST as `ast.mcxTemplate` (also available via `services.mcxTemplate`), so custom rules can walk the `ParsedTagNode` tree to lint template structure. Multiple `<script>` blocks are merged into a single Program (scope analysis is based on the first block).
