
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');
let Sprite = require('./Sprite.js');

class Player {
    constructor(game, id, owner, teamIndex, cell) {
        this.id = id;
        this.owner = owner;
        this.teamIndex = teamIndex;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = new Sprite(game, SPRITE.PLAYER, 3, 3, this.cell, this.teamIndex);
        return sprite;
    }
    destroy() {
        this.sprite.destroy();
    }
    setCell(cell, direction) {
        this.cell = cell;
        this.sprite.setCell(this.cell);
        this.sprite.setDirection(direction);
    }
}

module.exports = Player;
