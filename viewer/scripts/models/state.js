var Cell = require('../engine/models/Cell');

class State {
    constructor(players, collectables, spawnPoints, teamInfo) {
        this.players = players;
        this.collectables = collectables;
        this.spawnPoints = spawnPoints;
        this.teamInfo = teamInfo;
    }

    static parse(phase, gameData) {
        let state = new State(
            parsePlayerPositions(phase, gameData),
            parseCollectablePositions(phase, gameData),
            parseSpawnPositions(phase, gameData)
        );

        return state;
    }

    static parseEnumerable(gameData) {
        let states = [];
        for (let i = 0; i < gameData.phaseResults.length; i++) {

            let previousState = null;
            let teamInfo = gameData.game.teams.map(() => ({
                playerCount: 0,
                owner: null,
                spawnCount: 0,
                disqualificationReason: null
            }));

            if (i > 0) {
                previousState = states[i - 1];
            }

            mapTeamOwners(gameData, teamInfo);
            parseDisqualificationReasons(gameData.phaseResults[i], teamInfo);

            let state = new State(
                parsePlayerPositions(i, gameData, previousState, teamInfo),
                parseCollectablePositions(i, gameData, previousState),
                parseSpawnPositions(i, gameData, previousState, teamInfo),
                teamInfo
            );

            states.push(state);
        }

        return states;
    }
}

function mapTeamOwners(gameData, teamInfo) {
    gameData.spawnPoints.forEach((spawnPoint, teamIndex) => {
        teamInfo[teamIndex].owner = spawnPoint.owner;
    });
}

function parseDisqualificationReasons(state, teamInfo) {
    state.disqualifiedBots.forEach(disqualifiedBot => {
        teamInfo.find(team => team.owner === disqualifiedBot.id).disqualificationReason = disqualifiedBot.reason;
    });
}

function parsePlayerPositions(index, gameData, previousState, teamInfo) {
    let players = [];
    let previousPlayers = [];

    let spawnPoints = gameData.spawnPoints.map((spawnPoint, teamIndex) => ({
        id: spawnPoint.id,
        owner: spawnPoint.owner,
        cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
        teamIndex: teamIndex
    }));

    if (index > 0) {
        previousPlayers = previousState.players.map(previousPlayer => previousPlayer.id);
    }

    gameData.phaseResults[index].playerPositions.forEach(player => {
        let teamIndex = -1;
        let owner = null;

        if (index === 0 || previousPlayers.indexOf(player.id) === -1) {
            // Add owner and teamIndex for players that have just spawned
            let addedPlayerIndex = gameData.phaseResults[index].addedPlayers.map(addedPlayer => addedPlayer.id)
                                                                            .indexOf(player.id);

            owner = gameData.phaseResults[index].addedPlayers[addedPlayerIndex].owner || null;
            teamIndex = spawnPoints.find(spawnPoint => spawnPoint.owner === owner).teamIndex;
        } else {
            // Add owner and teamIndex for players that haven't just spawned
            let previousIndex = previousState.players.map(previousPlayer => previousPlayer.id)
                                                         .indexOf(player.id);

            owner = previousState.players[previousIndex].owner;
            teamIndex = previousState.players[previousIndex].teamIndex;
        }

        teamInfo[teamIndex].playerCount++;

        players.push({
            id: player.id,
            owner: owner,
            cell: new Cell(player.position.x, player.position.y),
            teamIndex: teamIndex
        });
    });

    return players;
}

function parseCollectablePositions(index, gameData, previousState) {
    let collectables = [];

    // Set current collectables to previous collectables
    if (index > 0) {
        collectables = previousState.collectables.slice(0);
    }

    // Add new collectables
    gameData.phaseResults[index].addedCollectables.forEach(addedCollectable => {
        collectables.push({
            id: addedCollectable.id,
            type: addedCollectable.type,
            cell: new Cell(addedCollectable.position.x, addedCollectable.position.y)
        });
    });

    // Remove collected collectables
    gameData.phaseResults[index].removedCollectables.forEach(removedCollectable => {
        let idIndex = collectables.map(collectable => collectable.id).indexOf(removedCollectable);

        if (idIndex !== -1) {
            collectables.splice(idIndex, 1);
        } else {
            console.log('Tried to remove a collectable that did not exist with id', removedCollectable);
        }
    });

    return collectables;
}

function parseSpawnPositions(index, gameData, previousState, teamInfo) {
    let spawnPoints = [];

    // Set the current spawn points to the previous spawn point
    if (index === 0) {
        gameData.spawnPoints.forEach((spawnPoint, teamIndex) => {
            spawnPoints.push({
                id: spawnPoint.id,
                owner: spawnPoint.owner,
                cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
                teamIndex: teamIndex
            });
            teamInfo[teamIndex].spawnCount++;
        });
    } else {
        let destroyedSpawns = [];
        spawnPoints = previousState.spawnPoints.slice(0);

        spawnPoints.forEach(spawnPoint => {
            teamInfo[spawnPoint.teamIndex].spawnCount = previousState.teamInfo[spawnPoint.teamIndex].spawnCount;

            // Decrement the count if the spawnPoint is in the removedSpawns array
            if (gameData.phaseResults[index].removedSpawnPoints.indexOf(spawnPoint.id) !== -1) {
                teamInfo[spawnPoint.teamIndex].spawnCount--;
                destroyedSpawns.push(spawnPoint.id);
            }
        });

        destroyedSpawns.forEach(destroyedSpawn => {
            let destroyedSpawnIndex = spawnPoints.map(spawnPoint => spawnPoint.id).indexOf(destroyedSpawn);
            spawnPoints.splice(destroyedSpawnIndex, 1);
        });
    }

    return spawnPoints;
}

module.exports = State;
