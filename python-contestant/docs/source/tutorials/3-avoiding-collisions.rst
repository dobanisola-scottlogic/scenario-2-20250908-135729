Avoiding Collisions
===================

**The Plan**

Currently the players will move wherever you tell them to, even if it results in colliding with water or each other.
We will add some logic to prevent this.

**Tracking the next positions**

We will maintain a list of positions that our players will occupy on the next turn, so that we can make sure no position
is occupied by 2 players. Add a new list instance attribute `next_positions` to your Bot's constructor:

.. code:: python

    def __init__(self, team: Team):
        super().__init__(team)
        self.last_moves = []
        self.next_positions = []

We will also add a method called `can_move` which will which will determine whether a given player is able to move in a
specific direction. It will return ``True`` only if the move:

- Would not result in crashing to another player on the same team (through our use of `next_positions`).
- Would not result in walking into water.

We also want `can_move` to update `next_positions` if it finds that the new calculated position is available:

.. code:: python

    def can_move(self, game_state: GameState, player: Player, direction: Direction) -> bool:
        new_position = game_state.map.get_neighbour(player.position, direction)
        can_move = new_position not in self.next_positions and new_position not in game_state.out_of_bounds_positions
        if can_move:
            self.next_positions.append(new_position)
        return can_move

We need to update `make_moves` to clear next_positions in the beginning of each turn, so add the following line
to the start of the method:

.. code:: python

    self.next_positions.clear()

**Random movement**

We will now make our players move randomly each turn instead of always north. To do this, replace the following in
`make_player_move`:

.. code:: python

    for move in self.last_moves:
        if move.player == player.id:
            return move
    return Move(player=player.id, direction=Direction.NORTH)

with:

.. code:: python

    return Move(player=player.id, direction=get_random_direction())

and import the get_random_direction function from the game.direction module:

.. code:: python

    from game.direction import Direction, get_random_direction

**Making use of can_move**

Now when we generate our move for the player, we need to check if that move is possible or if it would result in
death. We also want to maintain the current movement unless it would result in death as well.

Update `make_moves` to pass game_state to `make_player_move`:

.. code:: python

    self.make_player_move(player, game_state)

Replace `make_player_move` with:

.. code:: python

    def make_player_move(self, player: Player, game_state) -> Move:
        new_direction = get_random_direction()
        if self.can_move(game_state, player, new_direction):
            return Move(player=player.id, direction=new_direction)

Now, our code will generate a new random direction, and check whether the new direction will not result in death.
If the new direction would result in death, the player will do nothing and stay still for the current turn.

Notice how in that scenario the `make_player_move` method will return ``None``. We therefore need to make changes to
exclude ``None`` from `moves` in `make_moves`, as we must return only valid Move objects. Edit the `make_moves`
method as follows:

.. code:: python

    def make_moves(self, game_state: GameState) -> List[Move]:
        self.next_positions.clear()
        player_moves = (self.make_player_move(player, game_state) for player in game_state.players)
        moves = [move for move in player_moves if move]
        self.last_moves = moves
        return moves

We have moved calling `make_player_move` for each player in game state into a `player_moves`
`generator expression <https://docs.python.org/3/reference/expressions.html#generator-expressions>`_. We use a generator
expression here as we don't need to collect those moves into a list yet.
Then, we use list comprehension to generate moves for each move in player_moves if the move is not ``None``.

**Testing**

Now you're ready to send your Bot into battle, so run another game.

**Stop moving enemy players**

If you run the game now, your players should much longer. You may even meet enemy teams players. However, if you try
and move an enemy teams player, your bot will be disqualified. To avoid this, we need to not call `make_player_move`
on an enemy player. To achieve this, replace our generator expression in `make_moves` from:

.. code:: python

    player_moves = (self.make_player_move(player, game_state) for player in game_state.players)

with:

.. code:: python

    player_moves = (self.make_player_move(player, game_state) for player in game_state.players
                    if player.owner == self.id)

In the :doc:`next step<4-collecting-food>` we will look at how to collect food.