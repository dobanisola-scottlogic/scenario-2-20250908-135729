#!/usr/bin/env python3
import sys
import logging
from typing import Optional

from dacite import from_dict

from contestant import ContestantBot
from game.state import GameState
from game.team import Team
from util import json

logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)
logger = logging.getLogger()


class Main:

    def __init__(self):
        self.bot: Optional[ContestantBot] = None
        self.bot_initialised: bool = False

    def run(self):
        for line in sys.stdin:
            json_input = json.loads(line)
            if len(json_input) == 2 and 'id' in json_input and 'name' in json_input:
                self.bot = ContestantBot(from_dict(data_class=Team, data=json_input))
                self.bot_initialised = False
            else:
                if not self.bot_initialised:
                    self.bot.initialise(from_dict(data_class=GameState, data=json_input))
                    self.bot_initialised = True
                else:
                    bot_response = self.bot.make_moves(from_dict(data_class=GameState, data=json_input))
                    json_response = json.dumps(bot_response)
                    print(json_response, flush=True)


if __name__ == "__main__":
    main = Main()
    main.run()
