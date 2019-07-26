import logging
from typing import List

from bots.base import Bot
from game.move import Move
from game.state import GameState
from game.team import Team

logger = logging.getLogger()


class ExampleBot(Bot):

    def __init__(self, team: Team):
        super().__init__(team)

    def initialise(self, game_state: GameState) -> None:
        pass

    def make_moves(self, game_state: GameState) -> List[Move]:
        logger.info(game_state)
        return []
