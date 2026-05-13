# mcx Internal

## Architecture
```
 mcx
   | mcx-core
   | mcx-types
   | mcx-client
```
 - mcx-client: Runtime framework
 - mcx-types: TypeScript type package
 - mcx-core: Core compiler

## APIs Provided by mcx-core
Installation
```bash
npm install @mbler/mcx-core --save
```

## API

## AST

Internal AST generation.

### AST McxAst

MCX AST parser class.

```typescript
class McxAst {
  constructor(text: string);
  parseAST(): ParsedTagNode[];
  static generateCode(node: ParsedTagNode): string;
}
```

#### AST McxAst constructor

```typescript
constructor(text: string);
```

**Parameters:**
- `text: string` - MCX text to parse

---

#### AST McxAst parseAST

Parse MCX text into AST with line numbers.

```typescript
parseAST(): ParsedTagNode[];
```

**Return Value:**
- `ParsedTagNode[]` - Parsed AST node array

---

#### AST McxAst generateCode

Generate code string (recursively process content array).

```typescript
static generateCode(node: ParsedTagNode): string;
```

**Parameters:**
- `node: ParsedTagNode` - AST node to generate code for

**Return Value:**
- `string` - Generated code string

---

### AST prop

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

### Compiler CompileError

Compile error class.

```typescript
class CompileError extends Error {
  loc: { line: number; pos: number };
  constructor(message: string, loc: { line: number; pos: number });
}
```

**Properties:**
- `loc: { line: number; pos: number }` - Error location

**Parameters:**
- `message: string` - Error message
- `loc: { line: number; pos: number }` - Error location

---

### Compiler compileMCXFn

Convert MCX source file to build IR.

```typescript
function compileMCXFn(mcxCode: string): MCXCompileData;
```

**Parameters:**
- `mcxCode: string` - MCX source code

**Return Value:**
- `MCXCompileData` - Compiled data

---

### Compiler compileJSFn

Compile JavaScript code.

```typescript
function compileJSFn(jsCode: string): JsCompileData;
```

**Parameters:**
- `jsCode: string` - JavaScript code

**Return Value:**
- `JsCompileData` - Compiled JS data

---

## plugin

Generate Rollup language extension.

```typescript
function mcxPlugin(options: CompileOpt): Plugin;
```

**Parameters:**
- `options: CompileOpt` - Compile options

**Return Value:**
- `Plugin` - Rollup plugin

---

## transform

Convert MCX to JavaScript.

```typescript
async function transform(
  code: string,
  id: string,
  options: TransformOptions
): Promise<TransformResult>;
```

**Parameters:**
- `code: string` - MCX code
- `id: string` - File ID
- `options: TransformOptions` - Transform options

**Return Value:**
- `Promise<TransformResult>` - Transform result

---

## utils

Utility class.

```typescript
class McxUtils {
  static resolvePath(base: string, relative: string): string;
  static normalizeMCX(code: string): string;
  // ... other utilities
}
```
 - Usage
```javascript
const MCX = require("@mbler/mcx-core");
const ast = MCX.AST.prop("aaa=10\nbbb = bbb");
console.log(ast)
```
 - Function: Converts `key=value` format into AST
 - Type
```ts
type PropValue = number | string | object;
interface PropNode {
    key: string;
    value: PropValue;
    type: "PropChar" | "PropObject";
}
// MCX.AST.prop
declare function PropParser(code: string): PropNode[];
```

### Compiler Field
Types used
```ts
interface BuildCache {
    call: callList[];
    import: ImportList[];
    export: Array<ExportNamedDeclaration | ExportAllDeclaration | ExportDefaultDeclaration>;
}
declare const _MCXstructureLocComponentTypes: {
    readonly items: "item";
    readonly blocks: "block";
    readonly entities: "entity";
};
type MCXstructureLocComponentType = typeof _MCXstructureLocComponentTypes[keyof typeof _MCXstructureLocComponentTypes];
interface MCXstructureLoc {
    script: string;
    Event: {
        on: "after" | "before";
        subscribe: Record<string, string>;
        loc: {
            line: number;
            pos: number;
        };
        isLoad: boolean;
    };
    Component: Record<string, {
        type: MCXstructureLocComponentType;
        useExpore: string;
        loc: {
            line: number;
            pos: number;
        };
    }>;
}
declare class JsCompileData {
    node: t.Program;
    BuildCache: BuildCache;
    File: string;
    isFile: boolean;
    constructor(node: t.Program, BuildCache?: BuildCache);
    setFilePath(dir: string): void;
}
declare class MCXCompileData {
    raw: ParsedTagNode[];
    JSIR: JsCompileData;
    strLoc: MCXstructureLoc;
    File: string;
    isFile: boolean;
    constructor(raw: ParsedTagNode[], JSIR: JsCompileData, strLoc: MCXstructureLoc);
    setFilePath(dir: string): void;
}

declare class CompileError extends Error {
    loc: {
        line: number;
        pos: number;
    };
    constructor(message: string, loc: {
        line: number;
        pos: number;
    });
}
```
#### compileMCXFn
 - Usage
```javascript
const MCX = require("@mbler/mcx-core");
const buildIR = MCX.Compiler.compileMCXFn("<Event @after tick='50'>EntityHitEntity=entity</Event><script>export const entity = function(event){console.log(event)}</script>");
console.log(buildIR)
```
 - Function: Converts `mcx` source files to build IR
 - Type
```ts
declare function compileMCXFn(mcxCode: string): MCXCompileData;
```

### plugin Field
Generates rollup language extensions

### transform
Converts mcx to JavaScript

### ItemComponent
Used to create item JSON components

#### Constructor Parameters
```typescript
interface ItemComponentOptions {
  format: string;      // Format version, e.g., "1.21.100"
  name: string;        // Item display name
  id: string;         // Item unique identifier, e.g., "namespace:item_id"
  components?: ItemComponents; // Optional component configuration
}
```

#### Instance Methods
| Method | Description |
|--------|-------------|
| `#ItemComponent#toJSON()` | Generate final JSON object |
| `#ItemComponent#setName(newValue: string)` | Set item display name |
| `#ItemComponent#setIcon(newValue: string)` | Set item icon texture |
| `#ItemComponent#getName()` | Get item display name |
| `#ItemComponent#setId(newValue: string)` | Set item unique identifier |
| `#ItemComponent#getId()` | Get item unique identifier |
| `#ItemComponent#setAllowOffHand(vl: boolean)` | Set whether item can be held in off-hand |
| `#ItemComponent#setBlockPlacer(config)` | Set block placer component |
| `#ItemComponent#setCooldown(config)` | Set cooldown component |
| `#ItemComponent#setCompostable(config)` | Set compostable component |
| `#ItemComponent#setBundleInteraction(config)` | Set bundle interaction component |
| `#ItemComponent#setGlint(value: boolean)` | Set glint effect |
| `#ItemComponent#setHandEquipped(value: boolean)` | Set hand equipped |
| `#ItemComponent#setDigger(config)` | Set digger component |
| `#ItemComponent#setDamageAbsorption(config)` | Set damage absorption component |
| `#ItemComponent#setDurability(config)` | Set durability component |
| `#ItemComponent#setDurabilitySensor(config)` | Set durability sensor |
| `#ItemComponent#setDyeable(config)` | Set dyeable component |
| `#ItemComponent#setEnchantable(config)` | Set enchantable component |
| `#ItemComponent#setFood(config)` | Set food component |
| `#ItemComponent#setFireResistant(config)` | Set fire resistant component |
| `#ItemComponent#setEntityPlacer(config)` | Set entity placer |
| `#ItemComponent#setFuel(config)` | Set fuel component |
| `#ItemComponent#setKineticWeapon(config)` | Set kinetic weapon component |
| `#ItemComponent#setInteractButton(config)` | Set interact button |
| `#ItemComponent#setHoverTextColor(config)` | Set hover text color |
| `#ItemComponent#setLiquidClipped(config)` | Set liquid clipped |
| `#ItemComponent#setMaxStackSize(config)` | Set max stack size |
| `#ItemComponent#setPiercingWeapon(config)` | Set piercing weapon component |
| `#ItemComponent#setProjectile(config)` | Set projectile component |
| `#ItemComponent#setRecord(config)` | Set record component |
| `#ItemComponent#setRarity(config)` | Set rarity |
| `#ItemComponent#setRepairable(config)` | Set repairable component |
| `#ItemComponent#setSeed(config)` | Set seed component |
| `#ItemComponent#setStackedByData(config)` | Set stacked by data |
| `#ItemComponent#setShouldDespawn(config)` | Set despawn time |
| `#ItemComponent#setShooter(config)` | Set shooter component |
| `#ItemComponent#setStorageWeightModifier(config)` | Set storage weight modifier |
| `#ItemComponent#setStorageWeightLimit(config)` | Set storage weight limit |
| `#ItemComponent#setStorageItem(config)` | Set storage item component |
| `#ItemComponent#setThrowable(config)` | Set throwable component |
| `#ItemComponent#setTags(tags: string[])` | Set tags |
| `#ItemComponent#setSwingDuration(duration: number)` | Set swing duration |
| `#ItemComponent#setUseAnimation(animation)` | Set use animation |
| `#ItemComponent#setWearable(config)` | Set wearable component |
| `#ItemComponent#setUseModifiers(config)` | Set use modifiers |

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
Used to create block JSON components

**Note**: Current version of BlockComponent only contains basic structure, actual methods are under development.

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
| `#BlockComponent#toJSON()` | Generate final JSON object |

#### Usage Example
```typescript
import { BlockComponent } from "@mbler/mcx-core";

const blockComponent = new BlockComponent({
  format: "1.21.100",
  name: "Demo Block",
  id: "mcx_demo:demo_block"
});

const json = blockComponent.toJSON();
```

---

### EntityComponent
Used to create entity JSON components

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
| `#EntityComponent#toJSON()` | Generate final JSON object |
| `#EntityComponent#setId(newValue: string)` | Set entity unique identifier |
| `#EntityComponent#setFormat(newValue: string)` | Set format version |
| `#EntityComponent#setIsSpawnable(value: boolean)` | Set spawnable |
| `#EntityComponent#setIsSummonable(value: boolean)` | Set summonable |
| `#EntityComponent#setAddrider(config)` | Set addrider component |
| `#EntityComponent#setAdmireItem(config)` | Set admire item component |
| `#EntityComponent#setAgeable(config)` | Set ageable component |
| `#EntityComponent#setAngerLevel(config)` | Set anger level |
| `#EntityComponent#setAngry(config)` | Set angry component |
| `#EntityComponent#setAnnotationBreakDoor(config)` | Set break door annotation |
| `#EntityComponent#setAnnotationOpenDoor()` | Set open door annotation |
| `#EntityComponent#setAttack(config)` | Set attack component |
| `#EntityComponent#setAreaAttack(config)` | Set area attack component |
| `#EntityComponent#setAttackCooldown(config)` | Set attack cooldown |
| `#EntityComponent#setBalloonable(config)` | Set balloonable component |
| `#EntityComponent#setBarter(config)` | Set barter component |
| `#EntityComponent#setBlockClimber()` | Set block climber |
| `#EntityComponent#setBlockSensor(config)` | Set block sensor |
| `#EntityComponent#setBoostable(config)` | Set boostable component |
| `#EntityComponent#setBoss(config)` | Set boss component |
| `#EntityComponent#setBreakBlocks(config)` | Set break blocks |
| `#EntityComponent#setBreathable(config)` | Set breathable component |
| `#EntityComponent#setBribeable(config)` | Set bribeable component |
| `#EntityComponent#setBreedable(config)` | Set breedable component |
| `#EntityComponent#setBuoyant(config)` | Set buoyant component |
| `#EntityComponent#setBurnsInDaylight(config)` | Set burns in daylight |
| `#EntityComponent#setCannotBeAttacked()` | Set cannot be attacked |
| `#EntityComponent#setCanClimb()` | Set can climb |
| `#EntityComponent#setCanFly()` | Set can fly |
| `#EntityComponent#setCanJoinRaid()` | Set can join raid |
| `#EntityComponent#setCanPowerJump()` | Set can power jump |
| `#EntityComponent#setCollisionBox(config)` | Set collision box |
| `#EntityComponent#setColor(config)` | Set color |
| `#EntityComponent#setColor2(config)` | Set second color |
| `#EntityComponent#setDespawn(config)` | Set despawn component |
| `#EntityComponent#setEconomyTradeTable(config)` | Set economy trade table |
| `#EntityComponent#setEnvironmentSensor(config)` | Set environment sensor |
| `#EntityComponent#setEquipment(config)` | Set equipment component |
| `#EntityComponent#setExplode(config)` | Set explode component |
| `#EntityComponent#setFloating(config)` | Set floating component |
| `#EntityComponent#setFollower(config)` | Set follower component |
| `#EntityComponent#setHealth(config)` | Set health component |
| `#EntityComponent#setHerding(config)` | Set herding component |
| `#EntityComponent#setHome(config)` | Set home component |
| `#EntityComponent#setHurtOnCondition(config)` | Set hurt on condition |
| `#EntityComponent#setInertia(config)` | Set inertia component |
| `#EntityComponent#setInventory(config)` | Set inventory |
| `#EntityComponent#setJumpDynamic(config)` | Set dynamic jump |
| `#EntityComponent#setLeashable(config)` | Set leashable |
| `#EntityComponent#setLookAtPlayer(config)` | Set look at player |
| `#EntityComponent#setManaged(config)` | Set managed component |
| `#EntityComponent#setMountTaming(config)` | Set mount taming |
| `#EntityComponent#setNavFly(config)` | Set fly navigation |
| `#EntityComponent#setNavGoal(config)` | Set navigation goal |
| `#EntityComponent#setProjectile(config)` | Set projectile |
| `#EntityComponent#setRiderRotates(config)` | Set rider rotates |
| `#EntityComponent#setScale(config)` | Set scale |
| `#EntityComponent#setSchedule(config)` | Set schedule |
| `#EntityComponent#setSensors(config)` | Set sensors |
| `#EntityComponent#setSkinSettings(config)` | Set skin settings |
| `#EntityComponent#setSoulSpeed(config)` | Set soul speed |
| `#EntityComponent#setSpawnEntity(config)` | Set spawn entity |
| `#EntityComponent#setSwell(config)` | Set swell component |
| `#EntityComponent#setTameable(config)` | Set tameable |
| `#EntityComponent#setTeleport(config)` | Set teleport component |
| `#EntityComponent#setTickWorld(config)` | Set world tick |
| `#EntityComponent#setTrail(config)` | Set trail |
| `#EntityComponent#setVariant(config)` | Set variant |
| `#EntityComponent#setWalkTowards(config)` | Set walk towards |

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

#### Common Methods
| Method | Description |
|--------|-------------|
| `setAirborne(isAirborne: boolean)` | Set whether entity is airborne |
| `setCanFly(canFly: boolean)` | Set whether entity can fly |
| `setCanSwim(canSwim: boolean)` | Set whether entity can swim |
| `setHealth(health: number)` | Set health value |
| `setMovementSpeed(speed: number)` | Set movement speed |
| `addComponent(name: string, value: any)` | Add custom component |
| `toJSON()` | Generate final JSON object |

---

### ImageComponent
Used to create image components (PNG, JPG, SVG, GIF)

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
Type export module, provides type definitions for components

```typescript
import * as ComponentType from "@mbler/mcx-core/ComponentType";

// ItemComponentType - Item component type definition
// BlockComponentType - Block component type definition
// EntityComponentType - Entity component type definition
```