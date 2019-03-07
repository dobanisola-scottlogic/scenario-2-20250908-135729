# Adding Player Movement

## The Plan

Move your players off the spawn point so that they do not eliminate players spawned in the following turns.

## Code Updates

### Implementing Move

The first requirement is an implementation of the `Move` interface so that your orders can be returned to the game
engine, the bare minimum is given below.

```
import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Move;
import java.util.UUID;

public class MoveImpl implements Move {
    private UUID playerId;
    private Direction direction;

    public MoveImpl(UUID playerId, Direction direction) {
        this.playerId = playerId;
        this.direction = direction;
    }
    @Override
    public UUID getPlayer() {
        return playerId;
    }
    @Override
    public Direction getDirection() {
        return direction;
    }
}
```

As mentioned in the `README`, this should either be an inner class within the file containing your bot, or placed in a
separate package, e.g. `com.contestantbots.util`.

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

### Testing

Now you're ready to send your initial Bot into battle, so run another game.

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

The game should now have lasted 21 phases, but still end with the `LONE_SURVIVOR` end condition as all your players
march in a neat line directly northwards and straight into the nearby water!

In the [next step](2-maintaining-history.md) we will look at maintaining a history the directions
that your players are travelling in.
