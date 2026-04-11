# mcx Internal

## Architecture
__code__
 mcx
  | mcx-core
  | mcx-types
  | mcx-client
__code__
 - mcx-client: Runtime framework
 - mcx-types: TypeScript type package
 - mcx-core: Core compiler

## APIs Provided by mcx-core
Installation
__code__bash
npm install @mbler/mcx --save
__code__
Overall structure of the provided APIs
__code__
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
  // Exported types
  PUBTYPE: {},
  ItemComponent: [class ItemComponent],
  EntityComponent: [class EntityComponent],
  BlockComponent: [class BlockComponent]
}
__code__
(Note: Except for the __code__PUBTYPE__code__ field, other fields that do not appear here but are available for use are experimental or subject to deletion)

### AST Field
Internal AST generation
#### tag
 - Usage
__code__javascript
const MCX = require("@mbler/mcx-core");
const ast = new MCX.AST.tag("<script>console.log('Hello world')</script>");
console.log(ast.parseAST())
__code__
 - Function: Converts HTML content into an AST with line numbers
 - Type of __code__MCX.AST.tag__code__:
__code__ts
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
__code__
#### prop
 - Usage
__code__javascript
const MCX = require("@mbler/mcx-core");
const ast = MCX.AST.prop("aaa=10\nbbb = bbb");
console.log(ast)
__code__
 - Function: Converts __code__key=value__code__ format into AST
 - Type
__code__ts
type PropValue = number | string | object;
interface PropNode {
    key: string;
    value: PropValue;
    type: "PropChar" | "PropObject";
}
// MCX.AST.prop
declare function PropParser(code: string): PropNode[];
__code__

### Compiler Field
Types used
__code__ts
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
__code__
#### compileMCXFn
 - Usage
__code__javascript
const MCX = require("@mbler/mcx-core");
const buildIR = MCX.Compiler.compileMCXFn("<Event @after tick='50'>EntityHitEntity=entity</Event><script>export const entity = function(event){console.log(event)}</script>");
console.log(buildIR)
__code__
 - Function: Converts __code__mcx__code__ source files to build IR
 - Type
__code__ts
declare function compileMCXFn(mcxCode: string): MCXCompileData;
__code__

### plugin Field
Generates rollup language extensions

### transform
Converts mcx to JavaScript

### ItemComponent
Used to create item JSON components

### BlockComponent
Used to create block JSON components

### EntityComponent
Used to create entity JSON components