
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');
let Sprite = require('./Sprite.js');

class Player {
    constructor(game, id, owner, colour, cell) {
        this.id = id;
        this.owner = owner;
        this.colour = colour;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = new Sprite(game, SPRITE.PLAYER, 3, 3, this.cell, this.colour);
        sprite.addAnimation('run');
        sprite.playAnimation('run');
        return sprite;
    }
    setPaused(paused) {
        this.sprite.setPaused(paused);
    }
    destroy() {
        this.sprite.destroy(true);
    }
    setCell(cell, direction) {
        this.cell = cell;
        this.sprite.setCell(this.cell);
        this.sprite.setDirection(direction);
    }
    setTranslate(game, cell, direction, xTranslate, yTranslate) {

        this.sprite.setDirection(direction);
        if (this.doubleSprite) { this.doubleSprite.destroy(); }

        // Calculate the intended change in cell
        let xDelta = cell.column - this.cell.column;
        let yDelta = cell.row - this.cell.row;

        // Check if sprite wrapped around the map
        if ((Math.abs(xDelta) <= 1) && (Math.abs(yDelta) <= 1)) {
            this.sprite.setTranslate(game, cell);
        } else {
            let wrapAroundCell = new Cell(cell.column - xTranslate,
                                          cell.row - yTranslate);
            this.doubleSprite = this.sprite.copySpriteToCell(game, this.cell);
            this.sprite.setCell(wrapAroundCell);
            this.doubleSprite.setTranslate(game, new Cell(this.cell.column + xTranslate, this.cell.row + yTranslate));
            this.sprite.setTranslate(game, cell);
        }

        this.cell = cell;
    }
}

module.exports = Player;
