Next steps
==========

There are a few improvements that could be made to this basic bot. This is a list of ideas to get you started

- Is it a good idea to give each player a random direction each turn if it isn't near any food? Should they keep moving
  in the direction they were going previously instead?
- Some of the players get stuck at the sea if there is food close to them on the other side. How could this be fixed?
- What is the best way to make players explore the map so that the players can see more food?
- How could the players decide which food to go for more effectively?
- Should multiple players go for the same food item?
- When a player can't move, their position is not added to the list of positions that will be occupied next turn.
  This can result in players colliding.
- Perhaps the dictionary idea could be extended to store {player: YourOwnCustomClass}, where the objects of your new
  class could have a direction property as well as several others. This would enable you to store much more information
  about each player.
- This tutorial does not consider any fighting logic. How should your players react to seeing enemy players? Or even
  enemy spawns?

**Methods available to you**

This tutorial does not cover all of the available methods provided by the game engine. The
:doc:`API Reference <../modules>` lists all available methods for you, so refer to it during development of your Bot.

Below are some of those methods that could be useful in adding more complexity to your bots.

**GameState**

:attr:`GameState.spawn_points<game.state.GameState.spawn_points>` is a list of all the spawn points your players can see.
You can see the owner of the spawn points with:

.. code:: python

    for spawn_point in game_state.spawn_points:
        owner = spawn_point.owner

As used in the `can_move` method in the tutorial,
:attr:`GameState.out_of_bounds_positions<game.state.GameState.out_of_bounds_positions>` is a list of all the out of
bounds positions. This could be useful if you are storing them across turns.

See more about this class :class:`here <game.state.GameState>`.

**Map**

You can access the Map via :attr:`GameState.map<game.state.GameState.map>`; which also provides a variety of different
methods. Some simple methods this provides include:

- :attr:`Map.height<game.map.Map.height>`
- :attr:`Map.width<game.map.Map.width>`
- :meth:`Map.get_position<game.map.Map.get_position>`
- :meth:`Map.distance_between<game.map.Map.distance_between>`
- :meth:`Map.directions_towards<game.map.Map.directions_towards>`

The last one returns an iterator of :class:`Directions<game.direction.Direction>`, which generates a number of directions
which are towards a target :class:`Position<game.position.Position>`. To access the first direction, you can use Python's
built-in function `next() <https://docs.python.org/3/library/functions.html#next>`_. Providing a second argument to next
allows you to set a default return if the iterator is exhausted:

.. code:: python

    directions_iterator = map.directions_towards(current_position, target_position)
    next_direction = next(directions_iterator, None)
    if next_direction is not None:
        # Do something with next_direction
    else:
        # Iterator exhausted

With no default set, `next()` will raise a ``StopIteration`` exception
which you can catch and handle:

.. code:: python

    directions_iterator = map.directions_towards(current_position, target_position)
    try:
        next_direction = next(directions_iterator)
        # Do something with next_direction
    except StopIteration:
        # Iterator exhausted

If you want to then get the opposite direction (perhaps to make the players move away from the water), it can be
achieved by using :meth:`Direction.get_opposite()<game.direction.Direction.get_opposite>`. If you want an iterator
generating directions away from a position, you can use :meth:`Map.directions_away<game.map.Map.directions_away>` in
a similar way as directions_towards().

**Route**

A slightly more advanced method to use is the :func:`route.find_route<game.route.find_route>` function. You provide this
the game map, a destination, a start and a predicate function that takes a position and returns a boolean result.

An example predicate function to supply is:

.. code:: python

    lambda position: position in game_state.out_of_bounds_positions

The returned route is guaranteed not to include positions for which this predicate returns ``True``.

This function uses the A* algorithm to calculate the route, but it is advised to only calculate routes with this function
for short distances, else your bot may take longer than the turn limit.

A route could be calculated like this:

.. code:: python

    from game import route

    route_to_enemy_spawn_point = route.find_route(game_state.map, current_player_position, enemy_spawn_point_position,
                                                    lambda position: position in game_state.out_of_bounds_positions)

As per the documentation for the function, this has the potential to return None, so check if the returned route is not
None before trying to access it.
