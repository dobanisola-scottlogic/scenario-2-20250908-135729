# Hackathon Code Challenge

This is programming challenge where contestants must write code that can play a simple strategy game.

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