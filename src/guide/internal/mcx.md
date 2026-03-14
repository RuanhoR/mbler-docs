# MCX Internals

## Architecture
```
 mcx
  | mcx-core
  | mcx-types
  | mcx-client
```
 - mcx-client: Runtime framework
 - mcx-types: ts type package
 - mcx-core: Core compiler

## The API provided by mcx-core
Installation
```bash
npm install @mbler/mcx --save
```
The overall structure of the API provided
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
  The type of export
  PUBTYPE: {}
}
```
(Note: Except for the 'PUBTYPE' field in this table, the other fields do not appear, but some fields are experimental or may be deleted)
### AST field
Internal AST generation
#### tag
 - Use
```javascript
const MCX = require("@mbler/mcx-core");
const ast = new MCX.AST.tag("<script>console.log('Hello world')</script>");
console.log(ast.parseAST())
```
 - Function: Turn HTML fields into ASTs with line numbers
 - Type of 'MCX.AST.tag':
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
     * Generate code strings (recursively process content arrays)
     * @param node The AST node to generate the code
     * @returns The generated code string
     */
    static generateCode(node: ParsedTagNode): string;
}
```
#### prop
 - Use
```javascript
const MCX = require("@mbler/mcx-core");
const ast = MCX.AST.prop("aaa=10nbbb = bbb");
console.log(ast)
```
 - Function: Convert the format of 'key=value' to AST
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

### Compiler field
Type used
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
    Component: Record <string, {
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
 - Use
```javascript
const MCX = require("@mbler/mcx-core");
const buildIR = MCX.Compiler.compileMCXFn("<Event @after tick='50'>EntityHitEntity=entity</Event><script>export const entity = function(event){console.log(event)}</script>");
console.log(buildIR)
```
 - Function: Convert the 'mcx' source file to build IR
 - Type
```ts
declare function compileMCXFn(mcxCode: string): MCXCompileData;
```

### plugin field
Generate rollup language extensions

### transform
Transform mcx to js