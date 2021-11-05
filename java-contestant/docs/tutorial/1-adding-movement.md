# Adding Player Movement

## The Plan

Move your players off the spawn point so that they do not eliminate players spawned in the following turns. The code
that you will write will be in the `com.contestantbots.team.ExampleBot` class and should implement the
`make_moves` method.

## Code Updates

### Issuing Orders

The first thing we need to do is loop through the players and provide each of them with a direction. For now, we will
just make them all move north. Add the method moveNorth below to your class.

```
private List<Move> moveNorth(GameState gameState){
    List<Move> moves = new ArrayList<>();
    for (Player player : gameState.getPlayers()){
        Move movement = new MoveImpl(player.getId(), Direction.NORTH);
        moves.add(movement);
    }
    return moves;
}
```

This will loop through all of the players, giving each a direction of north. Then in the `makeMoves` method, replace

`return new ArrayList<>();`

with

```
List<Move> moves = moveNorth(gameState);
return moves;
```

### Logging

Logging can be useful to debug your code however it will also make your test runs longer. To enable logging call the
`process` method of `gameStateLoggerBuilder` on the first line of `makeMoves` with `gameState` as the
only parameter. The turn number will log by default but you can enable logging of the players, collectables,
spawn points or/and the out of bounds positions by calling `withPlayers()`, `withCollectables()`, `withSpawnPoints()`
or/and `withOutOfBounds()`. An example is given below where we wish to log the players,

```
gameStateLoggerBuilder.withPlayers().withOutOfBounds().process(gameState);
```

### Testing

Now you're ready to send your initial Bot into battle, so rebuild and reconnect your bot (as explained in the
[readme](readme.md)) to test it.

The game should now have lasted 22 phases, but still end with the `Game Over. One team remaining.` end condition as
all your players march in a neat line directly northwards and straight into the nearby water!

In the [next step](2-maintaining-history.md) we will look at maintaining a history the directions
that your players are travelling in.
