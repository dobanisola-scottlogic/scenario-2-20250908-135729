
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

class Collectable {
    constructor(phaser, id, type, position) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.sprite = this.constructSprite(phaser);
    }
    constructSprite(phaser) {
        let spawnSprite = phaser.add.sprite((this.position.x + 0.5) * PHASER.CELL.WIDTH,
                                               (this.position.y + 0.5) * PHASER.CELL.HEIGHT,
                                               SPRITE.COLLECTABLE.IDENTIFIER,
                                               0);
        spawnSprite.width = PHASER.CELL.WIDTH;
        spawnSprite.height = PHASER.CELL.HEIGHT;
        spawnSprite.anchor.setTo(0.5, 0.5);
        return spawnSprite;
    }
    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Collectable;
