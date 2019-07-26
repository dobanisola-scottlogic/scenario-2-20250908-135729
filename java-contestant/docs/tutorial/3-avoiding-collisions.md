# Avoiding Collisions

## The Plan

Currently the players will move wherever you tell them to, even if it results colliding into the water or each other. We will
add some logic to prevent this.

## Code Updates

### Tracking the next positions

We will maintain a list of positions that our players will occupy on the next turn, so that we can make sure no position
is occupied by 2 players. Add

`private List<Position> nextPositions;`

as an instance variable, and also initialise it with `nextPositions = new ArrayList<>();` at the beginning of
`makeMoves`, as we need to clear this list at the beginning of every turn, since it represents the positions our
players will occupy on the following turn.

We will add a method called `canMove` which will determine whether a given player is able to move in a specific direction.
It will return _True_ only if the move

- Would not result in crashing to another player on the same team (through our use of `nextPositions`)
- Would not result walking into water

```
private boolean canMove(final GameState gameState, final Player player, final Direction direction) {
    Set<Position> outOfBounds = gameState.getOutOfBoundsPositions();
    Position newPosition = gameState.getMap().getNeighbour(player.getPosition(), direction);
    if (!nextPositions.contains(newPosition) && !outOfBounds.contains(newPosition)) {
        return true;
    } else {
        return false;
    }
}
```

## Random movement

We will now make our players move randomly each turn instead of always north. Lets rename the method to
`moveRandomly` and add the randomness. To do this, replace

```
if (playerDirectionHashMap.containsKey(playerID)){
    // Do nothing, player already exists in the HashMap
}
else {
    playerDirectionHashMap.put(playerID, Direction.NORTH);
}
```

with

```
playerDirectionHashMap.put(playerID, Direction.random());
```

## Making use of makeMove

Now when we extract our moves from the HashMap, we need to check if that move is possible or if it would result in death.
Before this, we need to add a small helper function to find the Player object based on its ID.

```
private Player findPlayerByID(GameState gameState, Id id){
    for (Player player : gameState.getPlayers()){
        if (player.getId().equals(id)){
            return player;
        }
    }
    return null;
}
```

Now in extract moves, replace `moves.add(new MoveImpl(playerID, direction));` with

```
Player player = findPlayerByID(gameState, playerID);
if (player != null && canMove(gameState, player, direction)) {
    moves.add(new MoveImpl(playerID, direction));
    Position newPosition = gameState.getMap().getNeighbour(player.getPosition(), direction);
    nextPositions.add(newPosition);
}
else {
    // Player cannot move
}
```

This will check if the player exists and if the direction it has been assigned is a valid direction to move. If so, it will add the move,
otherwise it will do nothing and stay still.

Now the `extractMoves` method will only add moves to the HashMap if they would not result in the player crashing into the sea or another player.

### Testing

Now you're ready to send your Bot into battle, so run another game.

## Stop moving enemy players

If you run the game now, your players should much longer. You may even meet enemy teams players. However, if you try and move an enemy teams
player, your bot will be disqualified. To avoid this, we need to not add players to our HashMap if they belong to an enemy. To achieve this,
add a helper function

```
private boolean isMyPlayer(Player player){
    return player.getOwner().equals(getId());
}
```

and edit the `moveRandomly` method so it contains the following:

```
if (isMyPlayer(player)) {
    playerDirectionHashMap.put(playerID, Direction.random());
}
```

In the [next step](4-collecting-food.md) we will look at how to collect food.
