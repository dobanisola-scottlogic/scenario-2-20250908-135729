class Constants {
    constructor(id, width, height, outOfBoundPositions, spawnPoints, owners) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = outOfBoundPositions;
        this.spawnPoints = spawnPoints;
        this.owners = owners;
    }

    static parse(gameData) {
        let owners = [];
        gameData.spawnPoints.forEach(spawnPoint => {
            owners.push(spawnPoint.owner);
        });

        let constants = new Constants(
            gameData.id,
            gameData.map.width,
            gameData.map.height,
            gameData.map.outOfBoundPositions,
            gameData.spawnPoints,
            owners
        );

        return constants;
    }
}

module.exports = Constants;
