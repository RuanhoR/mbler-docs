# Getting start
## tip

> Tip: Please make sure you have some basic command line experience and know the basic syntax of JavaScript.

## install
It is based on nodejs and typescript. so you can't directly use to clone a git repository.  
 - From github: You should go to [this page](https://github.com/RuanhoR/mbler/releases), select latest, click `dist.zip` and download it
 - [download](/public/mbler-dist-0.1.1.zip)

Then, unzip this zip.(if you is windows user, plase use a tool like 7-zip) Open it with the terminal.

In unzip folder, to the dist folder.

Then, plase install [nodejs](https://nodejs.org). next, run
```bash
npm install && npm link
```
to install mbler

## init your package
You just pick any folder, open it with the terminal.  
Because mbler has a work dir feature, you should first run
```bash
mbler -c .
```
Then, in this folder, run
```bash
mbler init
```
Example Output(if you want to use English, plase run `mbler lang en`)
```
# mbler init
Project name:test
Project description:demo
Supported minecraft versions:1.21.100
Use Script API? (Y/N)Y
Main script path (such as ./index.js):index.js
Use UI? (Y/N)Y
Lang (按 b 确认，n 键选择下一个)
ts     js     mcx
```
It can generate some folders and files.

## write your minecraft-addon
Open `behavior/scripts` folder inside the just initialized folder.  
Create a main file(It's the one you entered when you initialized just now) in it foler.  

If you select ts, write ts, if you select js, write javascript

If you select mcx, plase go [mcx](/guide/mcx) 