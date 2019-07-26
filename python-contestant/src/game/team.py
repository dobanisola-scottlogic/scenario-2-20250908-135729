from dataclasses import dataclass


@dataclass(frozen=True)
class Team:
    """A bot's team details.

    Attributes:
        name (str): The bot's team name.
        id (int): The bot's team ID.
    """
    name: str
    id: int
