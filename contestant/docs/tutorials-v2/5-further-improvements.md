# Next steps

There are a few improvements that could be made to this basic bot. This is a list of ideas to get you started

- Is it a good idea to give each player a random direction each turn if it isn't near any food? Should they keep moving in the direction they were going
  previously instead?
- Some of the players get stuck at the sea if there is food close to them on the other side. How could this be fixed?
- What is the best way to make players explore the map so that the players can see more food?
- How could the players decide which food to go for more effectively?
- Should multiple players go for the same food item?
- When a player can't move, their position is not added to the list of positions that will be occupied next turn. This can result in players colliding
- Perhaps the HashMap idea could be extended to be of type `HashMap<UUID, YourOwnClass>`, where the objects of your new class could have a direction
  property as well as several others. This would enable you to store much more information about each player
- This tutorial does not consider any fighting logic. How should your players react to seeing enemy players? Or even enemy spawns?

## Methods available to you

This tutorial does not cover all of the available methods provided by the game engine. Below are some of the methods that could be useful in
adding more complexity to your bots.

#### The GameState object

`Set<SpawnPoint> spawnPoints = gameState.getSpawnPoints();` returns a list of all the spawn points your players can see. You can see the owner of the spawn
points with

```
for (SpawnPoint spawnPoint : spawnPoints){
    UUID owner = spawnPoint.getOwner();
}
```

As used in the `canMove` method, `Set<Position> outOfBounds = gameState.getOutOfBoundsPositions();` returns a list of all the out of bounds positions.
This could be useful if you are storing them across turns.

#### The GameMap object

You can access the GameMap via `GameMap gameMap = gameState.getMap();` which also provides a variety of different methods. Some simple methods this provide
include :

- `int height = gameMap.getHeight();`
- `int width = gameMap.getWidth();`
- `Position position = gameMap.createPosition(x,y);`
- `int distance = gameMap.distance(p1, p2);`
- `Optional<Direction> direction = gameMap.directionsTowards(positionFrom, positionTo).findFirst();`

The direction can be accessed with `direction.get()`, but it's always advised to check if the value is present. For example, something like this:

```
if (direction.isPresent()){
    Direction d = direction.get();
}
```

If you want to then to get the opposite direction (perhaps to make the players move away from a wall), it can be achieved by `Direction opposite = d.getOpposite();`

A slightly more advanced method it provides is the `findRoute` method. You provide this a destination, a start and a list of positions to be avoided. This
uses the A\* algorithm to calculate the route, but it is advised to only use calculate routes with this method for short distances, else your bot may take longer than 0.5s.

A route could be calculated like this:
`Optional<Route> route= gameState.getMap().findRoute(start, destination, gameState.getOutOfBoundsPositions());`. Since this returns an Optional, it has the
potential to return no Route. You can check to see if a route has been returned by using :

```
if (route.isPresent()){
    Route r = route.get();
}
else {
    // No route was found
}
```
