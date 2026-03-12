# Get started with Mbler

## Download
This tool relies on Nodejs, so please go to [Nodejs](https://nodejs.org) to download nodejs first. If you're a mobile phone party, you can search for Termux and download Nodejs first.  

Once Nodejs is installed, you can install it via commands
```bash
# npm
npm install -g mbler
# if error, try
sudo npm install -g mbler
# pnpm
pnpm install -g mbler
```
Then, you can confirm whether the installation was successful
```
mbler version
```
Once installed, you can start the next step

## Create a project
mbler has a working directory context that can be passed through
```bash
mbler c .
```
Switch the working directory to the current directory.
```bash
mbler init
```
will output
```
Project Name: test
Project Description: test
Select project language: (press b to confirm, n key to select next)
ts js mcx
Initializing dependencies? (y/n): (press b to confirm, n key to select next)
no pnpm npm
Using UI modules? (y/n): y
Initialize GIT Repository? (y/n): y
Using the Beta API? (y/n): y
```
A file will be generated
 - ![folder](/static/folder.svg) `behavior`
 - ![folder](/static/folder.svg) `node_modules`
 - ![yaml](/static/yaml_file.svg) `pnpm-lock.yaml`
 - ![jaon](/static/json_file.svg) `tsconfig.json` (only the language entered is ts or mcx)
 - ![jaon](/static/json_file.svg) `mbler.config.json`
 - ![jaon](/static/json_file.svg) `package.json`
 - ![folder](/static/folder.svg) `resources`

Among them, resources and behavior can put the JSON and other content of the original add-on package.  

After `mbler build` (or `npm run build`), it will be generated as an additional package, and you can set the outdir in `mbler.config.json` to the behavior package/resource package path of MC Bedrock for real-time testing.
What's next?
 - [Learning DSL](./mcx)
 - [Project Structure](./project)