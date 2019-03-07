# Maintaining History

## The Plan

We want to remember the direction each player was travelling in so that you know which direction the player moved last turn.

## Code Updates

### Using a HashMap

Instead of determining each players move every turn, we can use a HashMap to map each player to a specific direction.
We can use this to know which direction a player moved in previously, removing the need to recalculate it if we don't want to.
Add

`private HashMap<UUID, Direction> playerDirectionHashMap;`

as an instance variable. We also need to initialise
the HashMap, so add the following `initialise` method.

```
@Override
public void initialise(GameState gameState) {
    playerDirectionHashMap = new HashMap<>();
}
```

### Adding entries to the HashMap

Now we need to edit the `moveNorth` method to instead populate the HashMap. Replace the entirety of the method with:

```
private void moveNorth(GameState gameState){
    for (Player player : gameState.getPlayers()){
        UUID playerID = player.getId();
        if (playerDirectionHashMap.containsKey(playerID)){
            // Do nothing, player already exists in the HashMap
        }
        else {
            playerDirectionHashMap.put(playerID, Direction.NORTH);
        }
    }
}
```

Here we loop through all of the players and check if their ID exists in the HashMap. If it does exist, we do nothing.
Otherwise we add them to the HashMap with a direction of North.

### Extracting moves out of the HashMap

Now that we have generated entries into the HashMap, we need a way of extracting them out of it and using them in
`makeMoves`. To do this, we will create a method that extracts a list of moves from the HashMap. Add the following method:

```
private List<Move> extractMoves(GameState gameState){
    List<Move> moves = new ArrayList<>();
    for (Map.Entry<UUID, Direction> item : playerDirectionHashMap.entrySet()) {
        UUID playerID = item.getKey();
        Direction direction = item.getValue();
        moves.add(new MoveImpl(playerID, direction));
    }
    return moves;
}
```

This will loop through the entries in the HashMap, and create a new Move for each entry in the HashMap. Now we need to
update `makeMoves` to make use of these methods. Replace

```
List<Move> moves = moveNorth(gameState);
```

with

```
moveNorth(gameState);
List<Move> moves = extractMoves(gameState);
```

### Testing

Now you're ready to send your Bot into battle, so run another game.

Windows command prompt:

```batch
gradlew run -P mainClass=<your_bot_class_fully_qualified_name>
```

Unix shell:

```sh
./gradlew run -P mainClass=<your_bot_class_fully_qualified_name>
```

For example (Windows):

```sh
gradlew run -P mainClass=com.contestantbots.team.ExampleBot
```

### Removing dead players from the HashMap

If you run the program now, it should have lasted 15 or 16 phases with your bot being disqualified. This is because it
attempted to move a dead player that had crashed into the sea (because they still existed in the HashMap). To solve
this we just need to remove the dead players from the HashMap each turn. This can be done by adding

```
private void removeDeadPlayers(GameState gameState) {
    // Remove dead players from the HashMap
    for (Player p : gameState.getRemovedPlayers()) {
        playerDirectionHashMap.remove(p.getId());
    }
}
```

Now we just need to call this method at the beginning of `makeMoves`, so just beneath `gameStateLogger.process(gameState);` add

`removeDeadPlayers(gameState);`

In the [next step](3-avoiding-collisions.md) we will look at preventing the players from dying by walking into the sea.
