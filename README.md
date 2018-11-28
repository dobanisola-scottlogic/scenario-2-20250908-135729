# Coding Challenge

This is a programming challenge where contestants must write code that can play a simple strategy game.
Typically, this is used to run events with university students,
where attendees spend several hours in teams developing strategies and playing against each other.
See [here](running-events.md) for more details on running events.

## The Game

Each game is turn-based, and played by between 2 and 4 teams (or 'bots').
Every team has a base (or 'spawn point') on a 2D,
[donut-shaped](https://kotaku.com/classic-jrpg-worlds-are-actually-donuts-1239882216), grid-based map.
Distances between diagonally adjacent squares on the map are the same for horizontally or vertically adjacent squares
(all 8 squares surrounding a single square can be reached in s single move, rather than diagonal moves costing &radic;2).
The map includes permanent areas of water ('out of bounds positions'),
and pieces of food ('collectables') that are randomly generated each turn.
For the first 8 turns, a new 'player' is spawned for each team at their respective spawn point.

On every turn, each bot's `makeMoves` method is invoked. A `GameState` is passed in, describing the size of the map,
and objects on the map that the bot can 'see', this includes:
  - The bot's own spawn point (if it still exists)
  - All the bot's own currently living players
  - Any collectables, enemy spawn points, enemy players, or out-of-bounds positions that are within 5 moves of any
    of the bot's own players (effectively an 11&times;11 square around each player)
    
The `makeMoves` method must return a list of `Move` instances, each an instruction to move one of the bot's players in
one of 8 possible directions.

The aim of the game is to be the last team with living players on the map.
The following interactions affect the number of players:
  - If a bot's `makeMoves` method takes too long to execute or throws an Exception on any turn, the bot is disqualified.
  - If a bot's `makeMoves` returns an instruction to move a nonexistent or enemy player, the bot is disqualified.
  - If a bot's `makeMoves` returns multiple instructions to move the same player, the bot is disqualified.
  - If a player moves to an out-of-bounds position, it dies.
  - If two players collide, they both die.
  - If a player is outnumbered by enemy players on nearby positions (within 2 moves), it dies.
  - If a player moves to a position containing a collectable, the collectable disappears and a new player will be
    spawned from the bot's spawn point on the following turn (if it still exists).
  - If a player moves to the position of an enemy spawn point, the spawn point is destroyed, preventing that team from
    spawning new players by collecting food.

## Quick Start

### 1 - Extract contestant repo
Run:
```bash
./gradlew contestant:extractRepo -P repoDest=<destination_folder_path>
```
This will extract a copy of the stub repository given to contestants.
It contains instructions on how to get started with participating in the challenge.

### 2 - Run server
Run:
```bash
./gradlew server:run
```
This will start the web server application running on your local machine.
Point your browser at <http://localhost:8080/application> and login with username 'admin' and password 'secret'.

## Subprojects

This project is made up of a number of subcomponents:
  - [client](client) - A command-line client application for simulating games and rendering them as ASCII art.
    Provided to contestants so they can test and debug their code.
  - [contestant](contestant) - The skeleton project to be given to contestants,
    including a stub implementation of the strategy they have to write.
  - [default-bots](default-bots) - A library containing built in game strategies that contestants can play against
    on the client or server.
  - [deployment](deployment) - Scripts and configs for automating various modes of production deployment
    (self-hosted server, cloud, etc.).
  - [game](game) - A library containing the API of the game itself, including the interfaces available to contestants
    _and_ the game state model given to the client and server for rendering.
  - [game-engine](game-engine) - A library implementing the game API.
  - [server](server) - The web server application and REST back-end.
  - [viewer](viewer) - The front-end web application.

## Development

Run `./gradlew check` before committing, and check it passes. It will make people love you!