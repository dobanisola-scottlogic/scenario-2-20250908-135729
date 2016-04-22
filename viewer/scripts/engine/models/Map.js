
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Spawn = require('./Spawn');

class Map {
    constructor(gameData) {

        // Set default values
        this.tileGrid = [];
        this.obsticles = [];
        this.spawns = [];
        this.gameData = gameData;

        // Populate tileGrid
        for (let row = 0; row < this.gameData.constants.height; row ++) {
            let tileRow = [];
            for (let column = 0; column < this.gameData.constants.width; column ++) {
                tileRow.push(SPRITE.MAP.INDEXES.CLEAR);
            }
            this.tileGrid.push(tileRow);
        }

        // Populate obstacles
        this.gameData.constants.outOfBoundPositions.forEach((obstacle) => {
            this.tileGrid[obstacle.y][obstacle.x] = SPRITE.MAP.INDEXES.OBSTRUCTION;
        });
    }
    create(phaser) {
        for (let row = 0; row < this.tileGrid.length; row ++) {
            for (let column = 0; column < this.tileGrid[row].length; column ++) {
                let newTileSprite = phaser.add.sprite(column * PHASER.CELL.WIDTH,
                                                         row * PHASER.CELL.HEIGHT,
                                                         SPRITE.MAP.IDENTIFIER,
                                                         this.tileGrid[row][column]);
                newTileSprite.width = PHASER.CELL.WIDTH;
                newTileSprite.height = PHASER.CELL.HEIGHT;
                if (this.tileGrid[row][column] === SPRITE.MAP.INDEXES.OBSTRUCTION) {
                    this.obsticles.push(newTileSprite);
                }
            }
        }

        this.gameData.constants.spawnPoints.forEach((spawn) => {
            this.spawns.push(new Spawn(phaser, this.gameData, spawn));
        });
    }
    destroySpawn(spawnId) {
        let spawnIndex = this.spawns.map(spawn => spawn.id)
                                    .indexOf(spawnId);
        if (spawnIndex !== -1) {
            this.spawns[spawnIndex].destroy();
            this.spawns.splice(spawnIndex, 1);
        } else {
            console.log('ERROR : Failed to destroy spawn[' + spawnId + '].');
        }
    }
}

module.exports = Map;
