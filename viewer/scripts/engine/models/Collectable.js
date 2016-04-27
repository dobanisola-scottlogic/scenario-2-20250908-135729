
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');
let Sprite = require('./Sprite.js');

class Collectable {
    constructor(game, id, type, cell) {
        this.id = id;
        this.type = type;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = new Sprite(game, SPRITE.COLLECTABLE, 3, 3, this.cell, this.teamIndex);
        return sprite;
    }
    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Collectable;
