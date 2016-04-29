
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');
let COLOURS = require('../../enums/colours.js');

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
        let sprite = new Sprite(game, SPRITE.COLLECTABLE, 3, 3, this.cell, COLOURS.NONE);
        sprite.addAnimation('active');
        sprite.addAnimation('die');
        sprite.playAnimation('active');
        return sprite;
    }
    destroy() {
        this.sprite.destroy(true);
    }
}

module.exports = Collectable;
