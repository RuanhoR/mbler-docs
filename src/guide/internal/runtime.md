# Runtime Framework (`@mbler/mcx`)

The `@mbler/mcx` package provides the runtime framework for compiled MCX apps. It runs inside Minecraft Bedrock's Script API environment.

## Installation

```bash
npm install @mbler/mcx
```

## Exports

```javascript
import { createApp, Event, ui, Utils, types } from "@mbler/mcx";
```

## createApp

Creates an `App` instance from a compiled MCX app file.

```typescript
function createApp(app: MCXFile<'app'>): App;
```

**Parameters:**
- `app: MCXFile<'app'>` — The default export of a compiled app `.mcx` file

**Return Value:**
- `App` — An application instance

**Usage Example:**
```javascript
import { createApp } from "@mbler/mcx";
import { world } from "@minecraft/server";
import app from "./app.mcx";

const myApp = createApp(app);
myApp.mount(world);
```

---

## App

The application instance returned by `createApp`.

```typescript
class App {
  constructor(public app: MCXFile<'app'>);
  mount(world: World): void;
}
```

### App#mount

Mounts the app to a Minecraft world. This initializes all imported event MCX files, passes them into `ctx.event`, and runs `setup(ctx)`.

```typescript
mount(world: World): void;
```

**Parameters:**
- `world: World` — The Minecraft world instance (from `@minecraft/server`)

**Behavior:**
1. Iterates over `this.app.app.event` (if present)
2. Creates `Event` instances for each compiled event MCX
3. Calls `event.useWorld(world)` on each
4. Pushes all events into `ctx.event`
5. Calls the app's `setup(ctx)` function

---

## Event

Wraps Minecraft `WorldAfterEvents` / `WorldBeforeEvents` with handler management.

```typescript
class Event {
  constructor(opt: EventOpt);
  subscribe(...events: string[]): boolean;
  unsubscribe(...events: string[]): boolean;
  useWorld(w: World): void;
}
```

### Event#constructor

```typescript
constructor(opt: EventOpt);
```

**Parameters:**
- `opt: EventOpt` — Event configuration

```typescript
interface EventOpt {
  on: 'after' | 'before';                          // Subscribe to after or before events
  data: Record<string, (event: any) => void>;      // Event name -> handler mapping
  extends?: MCXFile<'event'>[];                    // Inherited event MCX files
  tick?: number;                                   // Throttle interval in ms
}
```

### Event#subscribe

Binds event handlers to Minecraft world events.

```typescript
subscribe(...events: string[]): boolean;
```

**Parameters:**
- `events: string[]` — Event names to subscribe to (e.g. `"PlayerJoin"`, `"EntityHitEntity"`). If called with no arguments, subscribes **all** registered handlers.

**Return Value:**
- `boolean` — `true` if all subscriptions succeeded

### Event#unsubscribe

Unbinds event handlers from Minecraft world events.

```typescript
unsubscribe(...events: string[]): boolean;
```

**Parameters:**
- `events: string[]` — Event names to unsubscribe. If called with no arguments, unsubscribes all.

**Return Value:**
- `boolean` — `true` if all unsubscriptions succeeded

### Event#useWorld

Switches the world instance used for event binding.

```typescript
useWorld(w: World): void;
```

**Parameters:**
- `w: World` — The new world instance

### Usage Example

```javascript
import { Event } from "@mbler/mcx";

const event = new Event({
  on: "after",
  data: {
    PlayerJoin: (event) => {
      console.log(`Player joined: ${event.player.name}`);
    },
  },
});

event.subscribe("PlayerJoin");
```

---

## ui

Builds and shows Minecraft Bedrock UI forms (ModalFormData, ActionFormData, MessageFormData).

```typescript
class ui {
  constructor(
    UIConfig: MCXUIOpt,
    mcxSrcFn: (ctx: MCXCtx & { $prop?: Record<string, any> }) => any
  );
  show(player: Player, prop: Record<string, any>): Promise<void>;
}
```

### ui#constructor

```typescript
constructor(UIConfig: MCXUIOpt, mcxSrcFn: (ctx: MCXCtx & { $prop?: Record<string, any> }) => any);
```

**Parameters:**
- `UIConfig: MCXUIOpt` — UI layout configuration (auto-generated from compiled UI MCX)
- `mcxSrcFn` — Source function that returns resolved props

### ui#show

Displays the UI to a player with runtime props.

```typescript
show(player: Player, prop: Record<string, any>): Promise<void>;
```

**Parameters:**
- `player: Player` — Target player
- `prop: Record<string, any>` — Runtime properties to bind (resolves `{{ propName }}` and `:param` bindings)

### UI Layout Types

| Type | UI Form Type | Description |
|------|-------------|-------------|
| `title` | All | Form title |
| `body` | ModalForm, ActionForm | Label/body text |
| `divider` | ModalForm, ActionForm | Visual divider |
| `input` | ModalForm | Text input field |
| `slider` | ModalForm | Slider control |
| `toggle` | ModalForm | Toggle switch |
| `dropdown` | ModalForm | Dropdown selection |
| `submit` | ModalForm | Submit button |
| `button` | ActionForm | Action button |
| `button-m` | MessageForm | Message dialog button |

### Dynamic Prop Binding

UI MCX supports runtime property binding:

- **Content binding**: `{{ propName }}` — resolved at runtime via `prop.propName`
- **Param binding**: `:param="propName"` — resolved via `{ useProp: "propName" }`
- **Click handler**: `<button click="functionName">` — resolved from script exports

### Usage Example

```javascript
import ui from "./ui.mcx";
import { world, system } from "@minecraft/server";

system.run(() => {
  const player = world.getPlayers()[0];
  ui.app.ui.show(player, { title: "Hello!" });
});
```

---

## Utils

Utility helpers.

```typescript
function generateAntiShake<T extends Function>(fn: T, tick: number): T;
```

### generateAntiShake

Creates a throttled version of a function. Prevents execution if called within `tick` milliseconds of the last call. Used internally by `Event` to implement the `tick` option.

```typescript
function generateAntiShake<T extends Function>(fn: T, tick: number): T;
```

**Parameters:**
- `fn: T` — The function to throttle
- `tick: number` — Throttle interval in milliseconds

**Return Value:**
- `T` — Throttled function

---

## types

Re-exports all TypeScript types from `@mbler/mcx-types`.

```typescript
import type { MCXCtx, EventOpt, MCXUIOpt, MCXFile, Event, ui } from "@mbler/mcx";
```
