# Tutorial
The default behaviour of the example Bot could not be any worse, it was only included to allow the set-up to be
validated, so let's take a look at how it could be improved.

## The Plan
This step-by-step tutorial will walk you through the process of adding some useful behaviour to your Bot and hopefully you should start to win some of those games against the default Bot and be able to take on some of the more sophisticated Bots.

This tutorial does not cover all of the available methods provided by the game engine. [Step five](5-further-improvements.md) discusses some of the methods that could be useful in adding more complexity to your bots.

### Step One - Adding Movement
Moving each player away from the spawn point will allow the next player to appear without eliminating both itself and
the previous player, see [adding player movement](1-adding-movement.md).

### Step Two - Maintaining History
Now that your players are moving around the map your games will be lasting slightly longer. Unfortunately, due to the naive approach adopted, your players are now marching north and into the water to drown. Let's look at [maintaining a history](2-maintaining-history.md) of the directions that your players are travelling in.

### Step Three - Avoiding Collisions
Your players can now move around the map but how can you [avoid collisions](3-avoiding-collisions.md) to prevent your players from dying by walking into the sea or eliminating each other by accident?

### Step Four - Collecting Food
Now that your players are surviving long enough without killing themselves, we need to tell them to [collect food](4-collecting-food.md) to spawn more players.

### Step Five - Further Improvements
There are a few improvements that could be made to this basic bot. You can find a list of ideas to get you started [here](5-further-improvements.md).
