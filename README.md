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

The Game Server is hosted on AWS
Contestants write their code using VSCode through a web browser at a contestant specific url.


### 1 - Configure Game Server Infrastructure

In the deployment submodule there is a directory `hackathon-ai-game/deployment/cli-src`. Navigate here and run an `npm install`.

Run the following in a shell that will ask a series of questions that your answers will be used to setup the infrastructure:
```bash
./cli configure
```
Note that some of the questions have default values in brackets if you leave these fields blank then the defaults will be applied.
This creates a `.cli-config` file to save config between runs.  (Note you will need relevant aws credentials)

### 2 - Deploy Game Server Infrastructure to AWS

Run:
```bash
./cli deploy
```
This will deploy the relevant cloud formation templates to aws
After some time when it is complete you will see a message showing the public url of the Hackathon Game Server
 
### 3 - Define new Hackathon in Game Server Admin 


Point your browser at <http://some_aws_domain/application> and login with username 'admin' and password 'secret'.

![define a new hackathon](images/definehackathon.png)


### 4 - Deploy Contestant Code Server (VS Code) to AWS

To create a new team in the hackathon
```bash
./cli create-team -t <my teamname>
```
**This will print the public DNS of the teams instance.**

It creates an entry in `.cli-team-config` to track the deployed teams.  
If  later to remove an individual team this can be done with the  command 
```bash
./cli delete-team -t <my teamname>
```

One you have the public DNS of the teams instance navigate to the following url for the Java contestant
http://public_dns/?folder=/home/coder/project/java-contestant

![java contestant](images/javacontestant.png)

or
http://public_dns/?folder=/home/coder/project/python-contestant for the Python Contestant

![python contestant](images/pythoncontestant.png)

The password is the team name


### 5 - Define Contestant Team in Game Server Admin 

Return to the Admin page for the Game Server

![define contestant team](images/defineteam.png)

Here you should define a new team for the chosen Hackathon using the teamname from step 4 as the name and password. Now you are all set up for your students to begin coding.

### Extra Information

**Delete Team**

To delete an existing team in the hackathon
```bash
./cli delete-team -t <my teamname>
```

**Delete Stack**

To save money delete the stack when you are finished, it takes a while.
To delete both of the CloudFormation stacks
```bash
./cli delete
```
If you are not sure whether it was successful or not you can check on aws that both the ECS cluster and EC2 instance no longer exist.

## Subprojects

This project is made up of a number of subcomponents:
  - [code-server](code-server) - Builds the docker image for a fully bootstrapped VS Code,
 
  - [default-bots](default-bots) - A library containing built in game strategies that contestants can play against
    on the server.
  - [deployment](deployment) - Scripts and configs for automating cloud  production deployment
 
  - [game](game) - A library containing the API of the game itself, including the interfaces available to contestants
    _and_ the game state model given to the server for rendering.
  - [game-engine](game-engine) - A library implementing the game API.
  - [java-contestant](java-contestant) - The java contestant files used in code-server.
  - [python-contestant](python-contestant) - The python contestant files used in code-server.
  - [remote](remote) - a distributed client for the game server to run the contestants game code.
  - [server](server) - The web server application and REST back-end.
  - [viewer](viewer) - The front-end web application.

## Development

Run `./gradlew check` before committing, and check it passes. It will make people love you!
