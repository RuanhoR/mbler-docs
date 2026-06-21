# Get started with Mbler

## Download

This tool relies on Nodejs, so please go to [Nodejs](https://nodejs.org) to download nodejs first. If you're a mobile phone party, you can search for Termux and download Nodejs first.

Once Nodejs is installed, you can install it via commands [npm package](https://npmjs.com/package/mbler)

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

## Create a project

```bash
pnpm create mbler
```

Some file will be generated.  
Among them, resources and behavior can put the JSON and other content of the original add-on package.

After `mbler build` (or `npm run build`), it will be generated as an additional package, and you can set the outdir in `mbler.config.js` to the behavior package/resource package path of MC Bedrock for real-time testing.
What's next?

- [Learning DSL](./mcx)
- [Project Structure](./project)
