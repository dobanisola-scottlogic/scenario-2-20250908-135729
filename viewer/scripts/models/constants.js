var Cell = require('../engine/models/Cell');
let CUTOFFCONDITION = require('../enums/cutoffCondition.js');

class Constants {
    constructor(id, width, height, outOfBoundPositions, spawnPoints, owners, teamInfo, cutoffCondition) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = outOfBoundPositions;
        this.spawnPoints = spawnPoints;
        this.owners = owners;
        this.teamInfo = teamInfo;
        this.cutoffCondition = cutoffCondition;
    }

    static parse(gameData) {
        let owners = [];
        let spawnPoints = [];
        let teamInfo = [];
        let cutoffCondition = '';

        switch (gameData.cutoffCondition) {
        case CUTOFFCONDITION.RANK_STABLE:
            cutoffCondition = 'No spawn points remaining.';
            break;
        case CUTOFFCONDITION.TURN_LIMIT_REACHED:
            cutoffCondition = 'Turn limit reached.';
            break;
        case CUTOFFCONDITION.LONE_SURVIVOR:
            cutoffCondition = 'One team remaining.';
            break;
        }

        gameData.spawnPoints.forEach((spawnPoint, index) => {
            owners.push(spawnPoint.owner);
            spawnPoints.push({
                id: spawnPoint.id,
                owner: spawnPoint.owner,
                cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
                teamIndex: index
            });
        });

        gameData.game.teams.forEach(team => {
            teamInfo.push(team);
        });

        let constants = new Constants(
            gameData.id,
            gameData.game.map.width,
            gameData.game.map.height,
            gameData.game.map.outOfBoundPositions,
            spawnPoints,
            owners,
            teamInfo,
            cutoffCondition
        );

        return constants;
    }
}

module.exports = Constants;
