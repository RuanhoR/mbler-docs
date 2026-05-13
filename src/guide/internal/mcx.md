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
Overall structure of the provided APIs
```
{
  AST: { tag: [class McxAst], prop: [Function: PropParser] },
  Compiler: [Object: null prototype] {
    CompileError: [class CompileError extends Error],
    CompileJS: [class CompileJS],
    compileJSFn: [Function: compileJSFn],
    compileMCXFn: [Function: compileMCXFn]
  },
  plugin: [Function: mcxPlugn],
  transform: [AsyncFunction: transform],
  utils: [class McxUtlis],
  compile_component: [Object: null prototype] {
    item: [class ItemComponent],
    entity: [class EntityComponent],
    block: [class BlockComponent]
  },
  // Exported types
  PUBTYPE: {},
  ItemComponent: [class ItemComponent],
  EntityComponent: [class EntityComponent],
  BlockComponent: [class BlockComponent],
  PNGImageComponent: [class PNGImageComponent],
  JPGImageComponent: [class JPGImageComponent],
  SVGImageComponent: [class SVGImageComponent],
  GIFImageComponent: [class GIFImageComponent],
  ComponentType: [Object: null prototype] {
    ItemComponentType: {...},
    BlockComponentType: {...},
    EntityComponentType: {...}
  }
}
```
(Note: Except for the `PUBTYPE` field, other fields that do not appear here but are available for use are experimental or subject to deletion)

### AST Field
Internal AST generation
#### tag
 - Usage
```javascript
const MCX = require("@mbler/mcx-core");
const ast = new MCX.AST.tag("<script>console.log('Hello world')</script>");
console.log(ast.parseAST())
```
 - Function: Converts HTML content into an AST with line numbers
 - Type of `MCX.AST.tag`:
```ts
interface BaseToken {
    data: string;
    type: TokenType;
    startIndex?: number;
    endIndex?: number;
    startLine?: number;
    loc?: MCXLoc;
}
interface TagToken extends BaseToken {
    type: 'Tag';
}
interface TagEndToken extends BaseToken {
    type: 'TagEnd';
}
interface ContentToken extends BaseToken {
    type: 'Content';
}
type Token = TagToken | TagEndToken | ContentToken;
type AttributeMap = Record<string, string | boolean>;
interface MCXLoc {
    start: {
        line: number;
        index: number;
    };
    end: {
        line: number;
        index: number;
    };
}
interface ParsedTagNode {
    start: TagToken;
    name: string;
    arr: AttributeMap;
    content: (ParsedTagContentNode | ParsedTagNode)[];
    end: TagEndToken | null;
    loc: MCXLoc;
}
interface ParsedTagContentNode {
    data: string;
    type: 'TagContent';
}
// MCX.AST.tag
declare class McxAst {
    constructor(text: string);
    parseAST(): ParsedTagNode[];
    /**
     * Generate code string (recursively process content array)
     * @param node AST node to generate code for
     * @returns Generated code string
     */
    static generateCode(node: ParsedTagNode): string;
}
```
#### prop
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

#### Basic Usage
```typescript
import { ItemComponent } from "@mbler/mcx-core";

const itemComponent = new ItemComponent({
  format: "1.21.100", // format version
  name: "Demo Item",
  id: "mcx_demo:demo_item"
});

// Allow item to be held in off-hand
itemComponent.setAllowOffHand(true);

// Set maximum stack size
itemComponent.setMaxStackSize(64);

// Add custom component
itemComponent.addComponent("minecraft:hand_equipped", true);

// Generate JSON
const json = itemComponent.toJSON();
```

#### Constructor Parameters
```typescript
interface ItemComponentOptions {
  format: string;      // Format version, e.g., "1.21.100"
  name: string;        // Item display name
  id: string;         // Item unique identifier, e.g., "namespace:item_id"
}
```

#### Common Methods
| Method | Description |
|--------|-------------|
| `setAllowOffHand(allow: boolean)` | Set whether item can be held in off-hand |
| `setMaxStackSize(size: number)` | Set maximum stack size |
| `setIcon(texture: string)` | Set item icon texture |
| `addComponent(name: string, value: any)` | Add custom component |
| `toJSON()` | Generate final JSON object |

---

### BlockComponent
Used to create block JSON components

#### Basic Usage
```typescript
import { BlockComponent } from "@mbler/mcx-core";

const blockComponent = new BlockComponent({
  format: "1.21.100",
  name: "Demo Block",
  id: "mcx_demo:demo_block"
});

// Set block hardness
blockComponent.setBlockHardness(1.5);

// Set block explosion resistance
blockComponent.setBlockExplosionResistance(3.0);

// Set block emissive
blockComponent.setEmissive(true);

const json = blockComponent.toJSON();
```

#### Constructor Parameters
```typescript
interface BlockComponentOptions {
  format: string;      // Format version
  name: string;        // Block display name
  id: string;          // Block unique identifier
}
```

#### Common Methods
| Method | Description |
|--------|-------------|
| `setBlockHardness(hardness: number)` | Set block hardness |
| `setBlockExplosionResistance(resistance: number)` | Set explosion resistance |
| `setFriction(friction: number)` | Set friction coefficient |
| `setEmissive(emissive: boolean)` | Set emissive |
| `addComponent(name: string, value: any)` | Add custom component |
| `toJSON()` | Generate final JSON object |

---

### EntityComponent
Used to create entity JSON components

#### Basic Usage
```typescript
import { EntityComponent } from "@mbler/mcx-core";

const entityComponent = new EntityComponent({
  format: "1.21.100",
  name: "Demo Entity",
  id: "mcx_demo:demo_entity"
});

// Set entity as airborne
entityComponent.setAirborne(true);

// Set entity can fly
entityComponent.setCanFly(true);

// Add custom component
entityComponent.addComponent("minecraft:behavior.random_stroll", {
  priority: 0,
  speed: 1.0
});

const json = entityComponent.toJSON();
```

#### Constructor Parameters
```typescript
interface EntityComponentOptions {
  format: string;      // Format version
  name: string;        // Entity display name
  id: string;          // Entity unique identifier
}
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