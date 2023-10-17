Adding Player Movement
======================

**The Plan**

Move your players off the spawn point so that they do not eliminate players spawned in the following turns. The code
that you will write will be in the `ExampleBot` class in the file `contestant/bot.py` and should implement the
`make_moves` method.

**Logging**

To print something to the console you will need to use the logger. The logger is defined in the outer scope already
`logger = logging.getLogger()` and to use it simple insert to your code `logger.info('what you wish to log')`. Remember
python is slow and logging will make your code slower so we recommend only logging when you need it.

**Issuing Orders**

The first thing we need to do is loop through the players and provide each of them with a direction. For now, we will
just make them all move :attr:`NORTH<game.direction.Direction.NORTH>`. Add the method `make_player_move` below to your
class:

.. code:: python

    def make_player_move(self, player: Player) -> Move:
        return Move(player=player.id, direction=Direction.NORTH)

This will take a player argument and return a new North movement for that player. Move is implemented in game/move.py,
it defines a movement by a player in a compass direction.

Remember to add import statements for each new class we introduce to our Bot:

.. code:: python

    from game.direction import Direction
    from game.player import Player

Then, in the make_moves method, replace:

.. code:: python

    return []

with:

.. code:: python

    return [self.make_player_move(player) for player in game_state.players]

This will generate a list of Move objects by calling `make_player_move` for each player in
:attr:`GameState.players<game.state.GameState.players>`. The `make_player_move` will return a Move for that player,
and then the resulting moves will be included in the returned list using
Python's `list comprehension <https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions>`_.

**Testing**

Now you're ready to send your upgraded Bot into battle, so run another game.

The game should now have lasted a bit longer, but still end with the `Game Over. One team remaining` end condition as
all your players march in a neat line directly northwards and straight into the nearby water!

In the :doc:`next step <2-maintaining-history>`, we will look at maintaining a history of the directions that your
players are travelling in.
