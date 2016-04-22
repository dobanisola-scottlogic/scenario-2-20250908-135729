
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

class Spawn {
    constructor(phaser, gameData, spawn) {
        this.id = spawn.id;
        this.owner = spawn.owner;
        this.position = spawn.position;
        this.sprite = this.constructSprite(phaser, gameData);
    }
    constructSprite(phaser, gameData) {
        let newSpawnSprite = phaser.add.sprite((this.position.x + 0.5) * PHASER.CELL.WIDTH,
                                               (this.position.y + 0.5) * PHASER.CELL.HEIGHT,
                                               SPRITE.SPAWN.IDENTIFIER,
                                               gameData.constants.owners.indexOf(this.owner));
        newSpawnSprite.width = PHASER.CELL.WIDTH * 3;
        newSpawnSprite.height = PHASER.CELL.HEIGHT * 3;
        newSpawnSprite.anchor.setTo(0.5, 0.5);
        return newSpawnSprite;
    }
    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Spawn;
