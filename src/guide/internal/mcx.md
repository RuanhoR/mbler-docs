# mcx Internal

## Architecture

The MCX ecosystem consists of the following npm packages:

| Package | Description |
|---------|-------------|
| `@mbler/mcx-core` | Core compiler: parses `.mcx` files, transforms to JavaScript, provides Rollup/Rolldown plugins |
| `@mbler/mcx` | Runtime framework: `createApp`, `Event`, `ui` classes for Minecraft Script API |
| `@mbler/mcx-types` | TypeScript type declarations for MCX projects |
| `@mbler/mcx-component` | Component builder classes: `ItemComponent`, `BlockComponent`, `EntityComponent`, image components |
| `create-mbler` | CLI scaffolding tool (`npm create mbler`) |

## Installation

```bash
npm install @mbler/mcx-core --save
```

## Exports

```javascript
import {
  PubType,           // Internal types namespace
  AST,               // { tag: McxAst, prop: PropParser }
  compiler,          // CompileJS, CompileMCX, CompileError, compileJSFn, compileMCXFn, MCXNodeUtils
  utils,             // Utils class (default export, static methods)
  transform,         // Transform MCX to JavaScript
  compile_component, // compileComponent, RunScript, FilePoint helpers
  rollupPlugin,      // Rollup plugin factory
  rolldownPlugin,    // Rolldown plugin factory
  // Component classes (re-exported from @mbler/mcx-component):
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  ComponentType,     // Namespace: component type definitions
} from "@mbler/mcx-core";
```

## API

## AST

Internal AST generation.

### AST#tag (McxAst)

MCX AST parser class.

```typescript
class McxAst {
  constructor(text: string, includeComments?: boolean);
  parseAST(): ParsedTagNode[];
  data: ParsedTagNode[];
  static generateCode(node: ParsedTagNode): string;
}
```

#### McxAst constructor

```typescript
constructor(text: string, includeComments?: boolean);
```

**Parameters:**
- `text: string` - MCX text to parse
- `includeComments?: boolean` - Whether to include comment nodes in the AST

---

#### McxAst parseAST

Parse MCX text into AST with line numbers.

```typescript
parseAST(): ParsedTagNode[];
```

**Return Value:**
- `ParsedTagNode[]` - Parsed AST node array

---

#### McxAst generateCode

Generate code string (recursively process content array).

```typescript
static generateCode(node: ParsedTagNode): string;
```

**Parameters:**
- `node: ParsedTagNode` - AST node to generate code for

**Return Value:**
- `string` - Generated code string

---

### AST#prop (PropParser)

Property parser function.

```typescript
function PropParser(code: string): PropNode[];
```

**Parameters:**
- `code: string` - Property code to parse

**Return Value:**
- `PropNode[]` - Parsed property node array

---

## Compiler

### Compiler#CompileError

Compile error class.

```typescript
class CompileError extends Error {
  loc: { line: number; column: number };
  constructor(message: string, loc: { line: number; column: number });
}
```

**Properties:**
- `loc: { line: number; column: number }` - Error location (line and column)

**Parameters:**
- `message: string` - Error message
- `loc: { line: number; column: number }` - Error location

---

### Compiler#compileMCXFn

Convert MCX source file to build IR.

```typescript
function compileMCXFn(mcxCode: string): MCXCompileData;
```

**Parameters:**
- `mcxCode: string` - MCX source code

**Return Value:**
- `MCXCompileData` - Compiled data (raw AST + JS IR + structure location)

---

### Compiler#compileJSFn

Compile JavaScript/TypeScript code.

```typescript
function compileJSFn(jsCode: string): JsCompileData;
```

**Parameters:**
- `jsCode: string` - JavaScript code

**Return Value:**
- `JsCompileData` - Compiled JS data with import/export reorganization

---

### Compiler#CompileJS

Class that transforms a Babel `t.Program` into `JsCompileData`.

```typescript
class CompileJS {
  constructor(node: t.Program);
  TopContext: Context;
  run(): void;
  getCompileData(): JsCompileData;
}
```

---

### Compiler#CompileMCX

Class that parses MCX source and produces `MCXCompileData`.

```typescript
class CompileMCX {
  constructor(code: string);
  getCompileData(): MCXCompileData;
}
```

---

### Compiler#MCXNodeUtils

Utility functions re-exported from the compiler module.

```typescript
namespace MCXNodeUtils {
  function ImportToCache(node: t.ImportDeclaration): ImportList;
}
```

---

### rollupPlugin

Create a Rollup plugin for `.mcx` and `.ts` file transformation.

```typescript
function rollupPlugin(
  opt: CompileOpt,
  output: { behavior: string; resources: string; dist: string }
): Plugin;
```

**Parameters:**
- `opt: CompileOpt` - Compile options (moduleDir, tsconfigPath, sourcemap, etc.)
- `output` - Output directories object

**Return Value:**
- `Plugin` - Rollup plugin instance

---

### rolldownPlugin

Create a Rolldown plugin for `.mcx` and `.ts` file transformation.

```typescript
function rolldownPlugin(
  opt: CompileOpt,
  output: { behavior: string; resources: string; dist: string }
): RolldownPlugin;
```

**Parameters:**
- `opt: CompileOpt` - Compile options
- `output` - Output directories object

**Return Value:**
- `RolldownPlugin` - Rolldown plugin instance

---

### transform

Convert MCX to JavaScript.

```typescript
async function transform(
  code: MCXCompileData,
  cache: Map<string, MCXCompileData>,
  id: string,
  context: TransformPluginContext,
  opt: CompileOpt,
  output: { behavior: string; resources: string; dist: string }
): Promise<string>;
```

**Parameters:**
- `code: MCXCompileData` - Compiled MCX data
- `cache: Map<string, MCXCompileData>` - Compile cache
- `id: string` - File ID
- `context: TransformPluginContext` - Rollup transform context
- `opt: CompileOpt` - Compile options
- `output` - Output directories

**Return Value:**
- `Promise<string>` - Transformed JavaScript code

---

### Utils

Utility class, provides file system operations and type verification.

```typescript
class Utils {
  static FileExist(path: string): Promise<boolean>;
  static readFile(filePath: string, opt?: ReadFileOpt): Promise<string | object>;
  static sleep(time: number): Promise<void>;
  static TypeVerify(obj: any, types: TypeVerifyBody): boolean;
  static AbsoluteJoin(baseDir: string, inputPath: string): string;
}
```

#### Utils#FileExist

Check if a file exists.

```typescript
static FileExist(path: string): Promise<boolean>;
```

**Parameters:**
- `path: string` - File path

**Return Value:**
- `Promise<boolean>` - Whether the file exists

---

#### Utils#readFile

Read file content, supports returning string or object, with retry mechanism.

```typescript
static readFile(
  filePath: string,
  opt?: ReadFileOpt
): Promise<string | object>;
```

**Parameters:**
- `filePath: string` - File path
- `opt?: ReadFileOpt` - Configuration options
  - `delay?: number` - Retry delay (default 200ms)
  - `maxRetries?: number` - Max retry count (default 3)
  - `want?: 'string' | 'object'` - Return type (default 'string')

**Return Value:**
- `Promise<string | object>` - File content

---

#### Utils#sleep

Delay execution.

```typescript
static sleep(time: number): Promise<void>;
```

**Parameters:**
- `time: number` - Delay time in milliseconds

**Return Value:**
- `Promise<void>`

---

#### Utils#TypeVerify

Verify object types at runtime.

```typescript
static TypeVerify(obj: any, types: TypeVerifyBody): boolean;
```

**Parameters:**
- `obj: any` - Object to verify
- `types: TypeVerifyBody` - Type definition, e.g., `{ name: 'string', age: 'number' }`

**Return Value:**
- `boolean` - Whether verification passed

---

#### Utils#AbsoluteJoin

Join paths, returns absolute path directly if input is absolute, otherwise joins with base directory.

```typescript
static AbsoluteJoin(baseDir: string, inputPath: string): string;
```

**Parameters:**
- `baseDir: string` - Base directory
- `inputPath: string` - Input path

**Return Value:**
- `string` - Absolute path

---

## Component Classes

The component builder classes (`ItemComponent`, `BlockComponent`, `EntityComponent`) are defined in `@mbler/mcx-component` and re-exported by `@mbler/mcx-core`. They are instantiated during compilation in a VM sandbox to produce Minecraft JSON component files.

### ItemComponent

Used to create item JSON components.

#### Constructor Parameters

```typescript
interface ItemComponentOptions {
  format: string;      // Format version, e.g. "1.21.100"
  name: string;        // Item display name
  id: string;          // Item unique identifier, e.g. "namespace:item_id"
  components?: ItemComponents; // Optional component configuration
}
```

#### Instance Methods

| Method | Description |
|--------|-------------|
| `toJSON()` | Generate final JSON object |
| `setName(newValue: string)` | Set item display name |
| `setIcon(newValue: string)` | Set item icon texture |
| `getName()` | Get item display name |
| `setId(newValue: string)` | Set item unique identifier |
| `getId()` | Get item unique identifier |
| `setAllowOffHand(vl: boolean)` | Set whether item can be held in off-hand |
| `setBlockPlacer(config)` | Set block placer component |
| `setCooldown(config)` | Set cooldown component |
| `setCompostable(config)` | Set compostable component |
| `setBundleInteraction(config)` | Set bundle interaction component |
| `setGlint(value: boolean)` | Set glint effect |
| `setHandEquipped(value: boolean)` | Set hand equipped |
| `setDigger(config)` | Set digger component |
| `setDamageAbsorption(config)` | Set damage absorption component |
| `setDurability(config)` | Set durability component |
| `setDurabilitySensor(config)` | Set durability sensor |
| `setDyeable(config)` | Set dyeable component |
| `setEnchantable(config)` | Set enchantable component |
| `setFood(config)` | Set food component |
| `setFireResistant(config)` | Set fire resistant component |
| `setEntityPlacer(config)` | Set entity placer |
| `setFuel(config)` | Set fuel component |
| `setKineticWeapon(config)` | Set kinetic weapon component |
| `setInteractButton(config)` | Set interact button |
| `setHoverTextColor(config)` | Set hover text color |
| `setLiquidClipped(config)` | Set liquid clipped |
| `setMaxStackSize(config)` | Set max stack size |
| `setPiercingWeapon(config)` | Set piercing weapon component |
| `setProjectile(config)` | Set projectile component |
| `setRecord(config)` | Set record component |
| `setRarity(config)` | Set rarity |
| `setRepairable(config)` | Set repairable component |
| `setSeed(config)` | Set seed component |
| `setStackedByData(config)` | Set stacked by data |
| `setShouldDespawn(config)` | Set despawn time |
| `setShooter(config)` | Set shooter component |
| `setStorageWeightModifier(config)` | Set storage weight modifier |
| `setStorageWeightLimit(config)` | Set storage weight limit |
| `setStorageItem(config)` | Set storage item component |
| `setThrowable(config)` | Set throwable component |
| `setTags(tags: string[])` | Set tags |
| `setSwingDuration(duration: number)` | Set swing duration |
| `setUseAnimation(animation)` | Set use animation |
| `setWearable(config)` | Set wearable component |
| `setUseModifiers(config)` | Set use modifiers |

#### Usage Example

```typescript
import { ItemComponent } from "@mbler/mcx-core";

const itemComponent = new ItemComponent({
  format: "1.21.100",
  name: "Demo Item",
  id: "mcx_demo:demo_item"
});

itemComponent.setAllowOffHand(true);
itemComponent.setMaxStackSize(64);
itemComponent.setIcon("textures/items/demo");

const json = itemComponent.toJSON();
```

---

### BlockComponent

Used to create block JSON components.

#### Constructor Parameters

```typescript
interface BlockComponentOptions {
  format: string;      // Format version
  name: string;        // Block display name
  id: string;          // Block unique identifier
}
```

#### Instance Methods

| Method | Description |
|--------|-------------|
| `toJSON()` | Generate final JSON object |
| `setBlockHardness(hardness: number)` | Set block hardness |
| `setBlockExplosionResistance(resistance: number)` | Set explosion resistance |
| `setFriction(friction: number)` | Set friction coefficient |
| `setEmissive(emissive: boolean)` | Set emissive lighting |
| `addComponent(name: string, value: any)` | Add custom component |

#### Usage Example

```typescript
import { BlockComponent } from "@mbler/mcx-core";

const blockComponent = new BlockComponent({
  format: "1.21.100",
  name: "Demo Block",
  id: "mcx_demo:demo_block"
});

blockComponent.setBlockHardness(1.5);
blockComponent.setBlockExplosionResistance(3.0);
blockComponent.setEmissive(true);

const json = blockComponent.toJSON();
```

---

### EntityComponent

Used to create entity JSON components.

#### Constructor Parameters

```typescript
interface EntityComponentOptions {
  format: string;      // Format version
  name: string;        // Entity display name
  id: string;          // Entity unique identifier
}
```

#### Instance Methods (Partial)

| Method | Description |
|--------|-------------|
| `toJSON()` | Generate final JSON object |
| `setId(newValue: string)` | Set entity unique identifier |
| `setFormat(newValue: string)` | Set format version |
| `setIsSpawnable(value: boolean)` | Set spawnable |
| `setIsSummonable(value: boolean)` | Set summonable |
| `setAddrider(config)` | Set addrider component |
| `setAdmireItem(config)` | Set admire item component |
| `setAgeable(config)` | Set ageable component |
| `setAngerLevel(config)` | Set anger level |
| `setAngry(config)` | Set angry component |
| `setAnnotationBreakDoor(config)` | Set break door annotation |
| `setAnnotationOpenDoor()` | Set open door annotation |
| `setAttack(config)` | Set attack component |
| `setAreaAttack(config)` | Set area attack component |
| `setAttackCooldown(config)` | Set attack cooldown |
| `setBalloonable(config)` | Set balloonable component |
| `setBarter(config)` | Set barter component |
| `setBlockClimber()` | Set block climber |
| `setBlockSensor(config)` | Set block sensor |
| `setBoostable(config)` | Set boostable component |
| `setBoss(config)` | Set boss component |
| `setBreakBlocks(config)` | Set break blocks |
| `setBreathable(config)` | Set breathable component |
| `setBribeable(config)` | Set bribeable component |
| `setBreedable(config)` | Set breedable component |
| `setBuoyant(config)` | Set buoyant component |
| `setBurnsInDaylight(config)` | Set burns in daylight |
| `setCannotBeAttacked()` | Set cannot be attacked |
| `setCanClimb()` | Set can climb |
| `setCanFly()` | Set can fly |
| `setCanJoinRaid()` | Set can join raid |
| `setCanPowerJump()` | Set can power jump |
| `setCollisionBox(config)` | Set collision box |
| `setColor(config)` | Set color |
| `setColor2(config)` | Set second color |
| `setDespawn(config)` | Set despawn component |
| `setEconomyTradeTable(config)` | Set economy trade table |
| `setEnvironmentSensor(config)` | Set environment sensor |
| `setEquipment(config)` | Set equipment component |
| `setExplode(config)` | Set explode component |
| `setFloating(config)` | Set floating component |
| `setFollower(config)` | Set follower component |
| `setHealth(config)` | Set health component |
| `setHerding(config)` | Set herding component |
| `setHome(config)` | Set home component |
| `setHurtOnCondition(config)` | Set hurt on condition |
| `setInertia(config)` | Set inertia component |
| `setInventory(config)` | Set inventory |
| `setJumpDynamic(config)` | Set dynamic jump |
| `setLeashable(config)` | Set leashable |
| `setLookAtPlayer(config)` | Set look at player |
| `setManaged(config)` | Set managed component |
| `setMountTaming(config)` | Set mount taming |
| `setNavFly(config)` | Set fly navigation |
| `setNavGoal(config)` | Set navigation goal |
| `setProjectile(config)` | Set projectile |
| `setRiderRotates(config)` | Set rider rotates |
| `setScale(config)` | Set scale |
| `setSchedule(config)` | Set schedule |
| `setSensors(config)` | Set sensors |
| `setSkinSettings(config)` | Set skin settings |
| `setSoulSpeed(config)` | Set soul speed |
| `setSpawnEntity(config)` | Set spawn entity |
| `setSwell(config)` | Set swell component |
| `setTameable(config)` | Set tameable |
| `setTeleport(config)` | Set teleport component |
| `setTickWorld(config)` | Set world tick |
| `setTrail(config)` | Set trail |
| `setVariant(config)` | Set variant |
| `setWalkTowards(config)` | Set walk towards |

#### Common Methods

| Method | Description |
|--------|-------------|
| `setAirborne(isAirborne: boolean)` | Set whether entity is airborne |
| `setCanFly(canFly: boolean)` | Set whether entity can fly |
| `setCanSwim(canSwim: boolean)` | Set whether entity can swim |
| `setHealth(health: number)` | Set health value |
| `setMovementSpeed(speed: number)` | Set movement speed |
| `addComponent(name: string, value: any)` | Add custom component |

#### Usage Example

```typescript
import { EntityComponent } from "@mbler/mcx-core";

const entityComponent = new EntityComponent({
  format: "1.21.100",
  name: "Demo Entity",
  id: "mcx_demo:demo_entity"
});

entityComponent.setCanFly(true);
entityComponent.setHealth({ value: 20, max: 20 });

const json = entityComponent.toJSON();
```

---

### ImageComponent

Used to create image components (PNG, JPG, SVG, GIF).

#### Basic Usage

```typescript
import {
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent
} from "@mbler/mcx-core";

// PNG image
const pngImage = new PNGImageComponent("./textures/item/demo.png");

// JPG image
const jpgImage = new JPGImageComponent("./textures/item/demo.jpg");

// SVG image
const svgImage = new SVGImageComponent("./textures/item/demo.svg");

// GIF image
const gifImage = new GIFImageComponent("./textures/item/demo.gif");
```

#### Image Component Type Reference

| Class | Supported Formats | Description |
|-------|-------------------|-------------|
| `PNGImageComponent` | `.png` | PNG image, suitable for icons and transparent images |
| `JPGImageComponent` | `.jpg`, `.jpeg` | JPEG image, suitable for photos |
| `SVGImageComponent` | `.svg`, `.xml` | SVG vector image |
| `GIFImageComponent` | `.gif` | GIF animated image |

---

### ComponentType

Type export namespace, provides type definitions for components.

```typescript
import { ComponentType } from "@mbler/mcx-core";
// ComponentType.ItemComponentOptions
// ComponentType.BlockComponentOptions
// ComponentType.EntityComponentOptions
// ComponentType.SoundEvent, ParticleType, EnchantableSlot, Rarity, etc.
```

---

## PubType

Internal type definitions namespace.

```typescript
import { PubType } from "@mbler/mcx-core";
// PubType.Token, PubType.ParsedTagNode, PubType.PropNode, PubType.transformCtx, etc.
```

---

## compile_component

Internal component compilation namespace.

```typescript
import { compile_component } from "@mbler/mcx-core";

compile_component.compileComponent(compiledCode, ctx): Promise<void>;
compile_component.clearCachedOptions(): void;
compile_component.resolveFilePoint(point, ctx, sourceIsMcxCore?): string;
compile_component.execEdit(option, ctx, isMcxCoreSource?): Promise<void>;
compile_component.generateItemTextureJson(output): Promise<void>;
compile_component.RunScript; // Class: runs JS in Node.js VM sandbox
compile_component.execESMMethod; // Enum: transformCjs | runInVm | importESM
compile_component.transformESMToCJS(code: string): string;
```

---

## @mbler/mcx-component

The `@mbler/mcx-component` package provides the component builder classes. It is a dependency of `@mbler/mcx-core` and its exports are re-exported through `@mbler/mcx-core`.

### Installation

```bash
npm install @mbler/mcx-component
```

### Exports

```typescript
import {
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  compareVar,  // Semantic version comparison
} from "@mbler/mcx-component";
```

### Enums

| Export | Description |
|--------|-------------|
| `SoundEventEnum` | All Minecraft sound event strings |
| `ParticleTypeEnum` | All particle type strings |
| `EnchantableSlotEnum` / `EnchantableSlotArray` | All enchantable slot strings |

### FileEdit Helpers

```typescript
import { createFileEdit } from "@mbler/mcx-component";
const edit = createFileEdit<MyType>({ /* expression */ });
```

---

## create-mbler

The `create-mbler` package provides a CLI scaffolding tool for new mbler projects.

### Usage

```bash
npm create mbler [dir] -- --language [zh|en]
```

### API

```typescript
import { cli, getI18n } from "create-mbler";

cli(): void;  // Run the scaffolder
getI18n(key: I18nKey, language: Language): string;
```
