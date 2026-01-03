# Experimental: mcx Syntax

mcx allows your MCBE behavior packs to avoid complex JSONs for items, recipes, etc., and also lets your event registration bypass cumbersome native and obscure method names. 
Let's look at the effect.

Set `script.main` in `mbler.config.json` to `index.js` (optional), then in the `ascripts` folder of the BP:

index.js
```javascript
import App from "./app.mcx";
import * as Server from "@minecraft/server";
import * as ScriptUi from "@minecraft/server-ui";
import { createApp } from "@mbler/mcx";
createApp(App).mout(Server, ScriptUi);
```

app.mcx
```
<script>
import Event from "./event.mcx";
import Component from "./component.mcx";
// Since this compiles into static JSON, it’s a macro, so it cannot be called repeatedly
Component.use();
// Register all events inside, you can also cancel all with `unsubscribe`, or specify events by name
Event.subscibe();
```

event.mcx
```
<Event @after>
PlayerJoin=eventHandler
</Event>
<script>
exports.PlayerJoin = function(event) {
    event.player.sendMessage("Welcome to the game")
}
</script>
```

component.mcx
```
<Component>
<items> <!-- register items -->
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
        display_name: "Test Item",
        allow_off_hand: true,
        hand_equipped: true,
        foil: true,
        glint: true
    }
})
</script>
```

This is a sample mcx project. mcx itself hasn’t been fully implemented yet, contributions are welcome (mcx is in the `lib/mcx` directory of the mbler source code).