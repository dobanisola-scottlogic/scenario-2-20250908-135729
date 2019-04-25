# Collecting food

## The Plan

Now that your players are surviving long enough without killing themselves, we need to tell them to collect food to spawn more players.

## Code Updates

### Making players move towards food

Add a method for collecting food:

```
private void collectFood(GameState gameState){
    for (Player player : gameState.getPlayers()){
        if (isMyPlayer(player)){
            for (Collectable food : gameState.getCollectables()){
                int distanceToFood = gameState.getMap().distance(player.getPosition(), food.getPosition());
                if (distanceToFood < 10){
                    Optional<Direction> direction = gameState.getMap().directionsTowards(player.getPosition(), food.getPosition()).findFirst();
                    if (direction.isPresent()){
                        playerDirectionHashMap.put(player.getId(), direction.get());
                    }
                }
            }
        }
    }
}
```

This will go through all of your players, and for each player loop through all of the food items. If the distance is less than 10, the player will move
towards that food. Note that a player will move towards the last food it finds that is less than 10 this is not necessarily the closest food and may not be the same food each turn. We then need to add a call to `collectFood` in the `makeMoves` method, so add `collectFood(gameState);` just
before `List<Move> movingNorth = extractMoves(gameState);`

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

In the [next step](5-further-improvements.md) we will look at other ways the bot could be improved
