
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Spawn = require('./Spawn');

class Map {
    constructor(width, height) {

        this.width = width;
        this.height = height;
        this.tileGrid = [];
        this.obsticles = [];
        this.spawns = [];

    }
    create(game, spawns, outOfBoundPositions) {
        // Populate tileGrid
        for (let row = 0; row < this.height; row ++) {
            let tileRow = [];
            for (let column = 0; column < this.width; column ++) {
                tileRow.push(SPRITE.MAP.ANIMATIONS.CLEAR);
            }
            this.tileGrid.push(tileRow);
        }

        // Populate obstacles
        outOfBoundPositions.forEach((obstacle) => {
            this.tileGrid[obstacle.y][obstacle.x] = SPRITE.MAP.ANIMATIONS.OBSTRUCTION;
        });

        for (let row = 0; row < this.tileGrid.length; row ++) {
            for (let column = 0; column < this.tileGrid[row].length; column ++) {
                let sprite = game.add.sprite(column * PHASER.CELL.WIDTH,
                                                         row * PHASER.CELL.HEIGHT,
                                                         SPRITE.MAP.IDENTIFIER,
                                                         this.tileGrid[row][column]);
                sprite.width = PHASER.CELL.WIDTH;
                sprite.height = PHASER.CELL.HEIGHT;
                if (this.tileGrid[row][column] === SPRITE.MAP.ANIMATIONS.OBSTRUCTION) {
                    this.obsticles.push(sprite);
                }
            }
        }

        spawns.forEach((spawn) => {
            this.spawns.push(new Spawn(game, spawn.id, spawn.owner, spawn.teamIndex, spawn.cell));
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
