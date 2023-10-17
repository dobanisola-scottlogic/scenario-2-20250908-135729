Collecting food
===============

**The Plan**

Now that your players are surviving long enough without killing themselves, we need to tell them to collect food to
spawn more players.

**Making players move towards food**

Firstly, rename the `make_player_move` method to `make_player_explore`.

Next, add the below `make_player_move` method, which will now call `make_player_explore`:

.. code:: python

    def make_player_move(self, player: Player, game_state) -> Move:
        return self.make_player_explore(player, game_state)

Add a new method `make_player_collect_food` for collecting food:

.. code:: python

    def make_player_collect_food(self, player: Player, game_state) -> Move:
        for food in game_state.collectables:
            distance_to_food = game_state.map.distance_between(player.position, food.position)
            if distance_to_food < 10:
                directions = game_state.map.directions_towards(player.position, food.position)
                direction = next(directions, None)
                if direction is not None and self.can_move(game_state, player, direction):
                    return Move(player.id, direction)

This will go loop through all of the food items. If the distance is less than 10 and the direction will not cause death,
the player will move towards that food. Note that a player will move towards the last food it finds that is less than 10
this is not necessarily the closest food and may not be the same food each turn.

We then need to add a call to `make_player_collect_food` in the `make_player_move` method, so modify `make_player_move`
to check if there's a collect move available for the player before returning the explore move:

.. code:: python

    def make_player_move(self, player: Player, game_state) -> Move:
        collect_move = self.make_player_collect_food(player, game_state)
        if collect_move is not None:
            return collect_move
        return self.make_player_explore(player, game_state)

**Testing**

Now you're ready to send your Bot into battle, so run another game.

In the :doc:`next step <5-further-improvements>` we will look at other ways the bot could be improved.