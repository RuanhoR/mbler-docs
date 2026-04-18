# Mbler Command Line Usage
## `c` Command
Introduction: Switch/View the working directory  
Usage: mblr c [?:dir]  
- No second parameter: Query the working directory
- With a second parameter: Set the working directory

Example:
```bash
mbler c .
# Should output: Set successfully
```
## `init` Command
Initialize a project, usage:
```bash
mbler init
```
## `lang` Command
Switch/Query the tool language, usage:
```bash
mbler lang
# Should output: zh or en
mbler lang en
# Should output: en
```
## `version` Command
Query the tool version, usage:
```bash
mbler version
# Output: commit: xxxx version: xxx
mbler version -show commit
# Output: commit: xxx
```
## `build` Command
Build the project as an mc addon. If `BUILD_MODULE` in the env is `build`, it will additionally generate a package that can be imported into the game.

## `watch` Command
Monitor changes and build in real time. No parameters, depends on the working directory context.

## `set-work-dir` Command
Set work dir manger mode.  
Example
- Use current cwd
```bash
mbler set-work-dir off
```
- Use work dir manger
```bash
mbler set-work-dir on
# set work dir
mbler work ./project
```

## `work` Command

Set work dir, more see `set-work-dir`

## `install` Command
- Tip: This command is planing

Usage: 

`mbler install @scope/name@version`

If no version, use `latest`  

Download a addon from `pmnx. qzz .io`

## `publish` Command
- Tip: This command is planing

Usage: 

`mbler publish -tag :tag_name`

Publish your addon  

Params
 - `tag`: Set tag name
 - `build`: `skip` or `on`, set can exetuce build command

## `unpublish` Command
- Tip: This command is planing

Usage:
`mbler unpublish @scope/name@version`

## `set-token` Command
- Tip This command is planing

Usage:
`mbler set-token <token>`
Set your `pmnx. qzz .io` token