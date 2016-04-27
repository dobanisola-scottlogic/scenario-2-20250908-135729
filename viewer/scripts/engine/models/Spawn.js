
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');
let Sprite = require('./Sprite.js');

class Spawn {
    constructor(game, id, owner, teamIndex, cell) {
        this.id = id;
        this.owner = owner;
        this.teamIndex = teamIndex;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = new Sprite(game, SPRITE.SPAWN, 3, 3, this.cell, this.teamIndex);
        return sprite;
    }
    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Spawn;
