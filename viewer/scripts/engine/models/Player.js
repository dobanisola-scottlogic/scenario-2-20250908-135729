
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
        sprite.addAnimation('die');
        sprite.playAnimation('run');
        return sprite;
    }
    setPaused(paused, resumeSpeed) {
        if (this.sprite) {
            this.sprite.setPaused(paused, resumeSpeed);
        }
    }
    destroy(playDeathAnimation, leavePhaserSprite) {
        this.sprite.destroy(playDeathAnimation);
    }
    setCell(cell, direction) {
        this.cell = cell;
        this.sprite.setCell(this.cell);
        this.sprite.setDirection(direction);
    }
    adjustPlaybackSpeed(phaseDelay, newPhaseDelay) {
        this.sprite.adjustPlaybackSpeed(phaseDelay, newPhaseDelay);
    }
    adjustVelocity(phaseDelay, newPhaseDelay) {
        this.sprite.adjustVelocity(phaseDelay, newPhaseDelay);
    }
    setTranslate(delay, cell, direction, xTranslate, yTranslate) {

        this.sprite.setDirection(direction);
        if (this.doubleSprite) { this.doubleSprite.destroy(); }

        // Calculate the intended change in cell
        let xDelta = cell.column - this.cell.column;
        let yDelta = cell.row - this.cell.row;

        // Check if sprite wrapped around the map
        if ((Math.abs(xDelta) <= 1) && (Math.abs(yDelta) <= 1)) {
            this.sprite.setTranslate(delay, cell);
        } else {
            let wrapAroundCell = new Cell(cell.column - xTranslate,
                                          cell.row - yTranslate);
            this.doubleSprite = this.sprite.copySpriteToCell(this.cell);
            this.sprite.setCell(wrapAroundCell);
            this.doubleSprite.setTranslate(delay, new Cell(this.cell.column + xTranslate, this.cell.row + yTranslate));
            this.sprite.setTranslate(delay, cell);
        }

        this.cell = cell;
    }
}

module.exports = Player;
