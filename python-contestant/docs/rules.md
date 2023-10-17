# RULES


1. [Goals](#Goal)
2. [Movement](#Movement)
3. [Spawning](#Spawning)
4. [Fighting](#Fighting)
5. [Disqualification](#Disqualification)

## Goal

The goal of the coding challenge is to end up with more bots than your opponent.

A bot is the overlord of the team, it controls the individual players.

On every turn, each bot's makeMoves method is invoked. A GameState is passed in, describing the size of the map, and objects on the map that the bot can 'see', this includes:

* The bot's own spawn point (if it still exists)
* All the bot's own currently living players
* Any collectables, enemy spawn points, enemy players, or out-of-bounds positions that are within 5 moves of any of the bot's own players (effectively an 11×11 square around each player)


## Movement

* The game is turn based with each turn being every player will move one space using the makeMoves method
* Movement can be in any direction including diagonals
* Each player has a vision of a 11x11 blocks (ie 5 on each side of it)
* When querying the game state what you get back is what collectively your players can see
* The water tiles are out of bounds so if the players move into a water tile it dies
* If two players collide, they both die.

## Spawning

* Your players will spawn from your single spawn point
* For the first 8 turns a player will spawn for free
* The players eat food by occupying the same space as the food
* Every time one of your players eat food another player will spawn on the next turn
* Food is spawned randomly across the map on free spaces
* You can destroy the opposing team's spawn point if your players occupy the same space as the spawn point
* Meaning the opposing team can't spawn any more players with no spawn point

## Fighting

* When your player comes within 2 moves of enemy players and are outnumbered your player will die and vice versa
* If there is a tie both sets of players die

## Disqualification

* If a bot's makeMoves method takes too long to execute or throws an Exception on any turn, the bot is disqualified.
* If a bot's makeMoves returns an instruction to move a nonexistent or enemy player, the bot is disqualified.
* If a bot's makeMoves returns multiple instructions to move the same player, the bot is disqualified
