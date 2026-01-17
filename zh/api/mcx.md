# 实验性： mcx 语法

mcx可以让你的mcbe行为包不需要复杂的物品、配方等的JSON，还能让你的事件注册不需要繁琐的操作原生和背方法名。  
先看效果  

将 `mbler.config.json` 里面的 script.main 设为 `index.js` （可选），然后在bp的ascripts文件夹里面
index.js
```javascript
import App from "./app.mcx";
import * as Server from "@minecraft/server";
import * as ScriptUi from "@minecraft/server-ui";
import { createApp } from "@mbler/mcx";
createApp(App).mout(SErver, ScriptUi);
```
app.mcx
```mcx
<script>
  import Event from "./event.mcx";
  import Component from "./component.mcx";
  // 由于是要编译成静态json的，是个宏，所以不能重复调用
  Component.use();
  // 整个事件里面的事件全部注册，也可以用unsubscibe全部取消，也可以传入对应事件名称操作指定事件
  Event.subscibe();
```
event.mcx
```mcx
<Event @after>
  PlayerJoin=eventHandler
</Event>
<script>
  exports.PlayerJoin = function(event) {
    event.player.sendMessage("欢迎进入游戏")
  }
</script>
```
component.mcx
```mcx
<Component>
  <items> <!--注册物品-->
    <item id=test>subscribe</item>
  </items>
</Component>
<script>
  import {
    ItemComponent
  } from "@mbler/mcx"
  export.subscribe = new ItemComponent({
    id: "mbler_test:test",
    opt: {
      stacked_by_data: true,
      max_stack_size: true,
      display_name: "测试物品",
      allow_off_hand: true,
      hand_equipped: true,
      foil: true,
      glint: true
    }
  })
</script>
```
这是一个示例mcx项目，当然还未实现mcx，欢迎代码贡献（mcx在mbler源码目录 `src/mcx` ）  
