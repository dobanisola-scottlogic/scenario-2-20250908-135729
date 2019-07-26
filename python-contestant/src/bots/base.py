from abc import ABC, abstractmethod
from typing import List

from game.move import Move
from game.state import GameState
from game.team import Team


class Bot(ABC):
    """Represents the overall strategy of an individual contestant in a game.
     A Bot's primary function is to determine a list of :class:`moves<game.move.Move>` to make at each stage in the
     game. It does this by implementing the :meth:`make_moves(GameState)<make_moves>` method.
    """

    def __init__(self, team: Team):
        """The default constructor initialises this bot's team details. Subclasses that define their own
        constructor must call this constructor using the super method::

            def __init__(self, team: Team):
                super().__init__(team)

        Args:
            team (Team): This bot's team details
        """
        self.id = team.id
        self.display_name = team.name

    def initialise(self, game_state: GameState) -> None:
        """Sets up any initial fields or data to be used by this bot later on in the game.

        This method is called once at the beginning of the game, before the first call to
        :meth:`make_moves(GameState)<make_moves>`. The given game state will be incomplete, defined by what this bot's
        first :class:`Player<game.player.Player>` can 'see' from its starting position. The default implementation of
        this method does nothing. Subclasses are free to override it.

        Args:
            game_state (GameState): This bot's 'view' of the initial state of the game.
        """
        pass

    @abstractmethod
    def make_moves(self, game_state: GameState) -> List[Move]:
        """Determines the set of moves the bot's players should make in response to the given state.
        The given GameState will typically be incomplete, defined by what this bot's
        :class:`Players<game.player.Player>` can 'see' from their current positions.

        The resulting list of moves must:
            - Only refer to this bot's players.
            - Not refer to the same player multiple times.

        If any of these criteria are not met, then this bot may be disqualified from the game, forfeiting it to other
        contestants.

        The returned list can be empty, in which case all of this bot's players will remain stationary.

        Args:
            game_state (GameState): This bot's 'view' of the current state of the game.

        Returns:
            List[:class:`Move<game.move.Move>`]: The moves this bot's players should make on the next phase.
        """
        pass
