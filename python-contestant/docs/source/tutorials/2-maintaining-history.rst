Maintaining History
===================

**The Plan**

We want to remember the direction each player was travelling in so that you know which direction the player moved last
turn.

**Using a list instance attribute**

Instead of determining each players move every turn, we can store a list of moves that map each player to a specific
direction. We can use this to know which direction a player moved in previously, removing the need to recalculate it if we don't
want to. Modify your Bot class constructor as below:

.. code:: python

    def __init__(self, team: Team):
        super().__init__(team)
        self.last_moves = []

The first line of your constructor must call the base class's constructor in order to pass in your Team details and
properly initialise your team's ID and display name, so do not modify it.

We will use the new `last_moves` instance attribute to store the moves calculated in the previous turn.

**Storing the last turn's moves**

Now we need to edit the `make_moves` method to store last turn's moves before returning them:

.. code:: python

    def make_moves(self, game_state: GameState) -> List[Move]:
        moves = [self.make_player_move(player) for player in game_state.players]
        self.last_moves = moves
        return moves

**Using last turn's moves**

Now that we have stored moves into our class, we need a way of using them in `make_moves`. To do this, we will modify
`make_player_move` to check the `last_moves` list before creating a new Move:

.. code:: python

    def make_player_move(self, player: Player) -> Move:
        for move in self.last_moves:
            if move.player == player.id:
                return move
        return Move(player=player.id, direction=Direction.NORTH)

This will loop through the entries in the list, and if it finds that the current player had a move in the last turn,
it will use the last turn's move as the next turn's move for that player. Otherwise it will generate a new North move
for that player.

**Testing**

Now you're ready to send your upgraded Bot into battle, so run another game.

In the :doc:`next step<3-avoiding-collisions>` we will look at preventing the players from dying by walking into the
sea.