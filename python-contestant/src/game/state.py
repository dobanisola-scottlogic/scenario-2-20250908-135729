from dataclasses import dataclass
from typing import List, Optional

from game.collectable import Collectable
from game.map import Map
from game.player import Player
from game.position import Position
from game.spawn_point import SpawnPoint


@dataclass(frozen=True)
class GameState:
    """
    A 'view' of the state of a game. Instances of this are often not complete, instead corresponding to what a
    particular :class:`Bot<bots.base.Bot>`'s :class:`Players<game.player.Player>` can 'see'.

    Attributes:
        phase (int): The current phase of the game. The phase starts at 0 and simply counts up during the game.
        map (Map): The game's map.
        out_of_bounds_positions (List[Position]): The out of bounds positions for the current game.
        players (List[Player]): The active players that are in the current game.
        removed_players (List[Player]): The dead players that were removed after the previous phase.
        spawn_points (List[SpawnPoint]): The active spawn points in the current game.
        removed_spawn_points (List[SpawnPoint]): The destroyed spawn points that were removed after the previous phase.
        collectables (List[Collectable]): The collectable items that are in the current game.
    """
    phase: int
    map: Map
    out_of_bounds_positions: List[Position]
    players: List[Player]
    removed_players: List[Player]
    spawn_points: List[SpawnPoint]
    removed_spawn_points: List[SpawnPoint]
    collectables: List[Collectable]

    def is_out_of_bounds(self, position: Position) -> bool:
        """Checks whether the given position is out of bounds.

        Args:
            position (Position): The position to check.

        Returns:
            ``bool``: ``True`` if the position is out of bounds, otherwise ``False``.
        """
        return position in self.out_of_bounds_positions

    def get_player_at(self, position: Position) -> Optional[Player]:
        """Gets the player at the given position, if there is one.

        Args:
            position (Position): The position to get the player at.

        Returns:
            :class:`Player<game.player.Player>` or ``None``: The player at the requested position, or ``None`` if there
            is none.
        """
        return next((player for player in self.players if player.position == position), None)

    def get_spawn_point_at(self, position: Position) -> Optional[SpawnPoint]:
        """Gets the spawn point at the given position, if there is one.

        Args:
            position (Position): The position to get the spawn point at.

        Returns:
            :class:`SpawnPoint<game.spawn_point.SpawnPoint>` or ``None``: The spawn point at the requested position, or
            ``None`` if there is none.
        """
        return next((sp for sp in self.spawn_points if sp.position == position), None)

    def get_collectable_at(self, position: Position) -> Optional[Collectable]:
        """Gets the collectable at the given position, if there is one.

        Args:
            position (Position): The position to get the collectable at.

        Returns:
            :class:`Collectable<game.collectable.Collectable>` or ``None``: The collectable at the requested position,
            or ``None`` if there is none.
        """
        return next((collectable for collectable in self.collectables if collectable.position == position), None)

    def is_position_empty(self, position: Position) -> bool:
        """Determines if the given position is accessible (i.e. not
        :meth:`out of bounds<is_out_of_bounds>`), and doesn't contain a player,
        spawn point, or collectable.

        Args:
            position (Position): The position to check.

        Returns:
            ``bool``: ``True`` if the given position is empty, ``False`` otherwise.
        """
        return not self.is_out_of_bounds(position) and self.get_player_at(position) is None and self.get_spawn_point_at(
            position) is None and self.get_collectable_at(position) is None
