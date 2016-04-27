
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');
let MOVEMENT = require('../../enums/movement.js');

let Cell = require('./Cell.js');

class Sprite {
    constructor(game, staticSprite, width, height, cell, teamIndex) {
        this.width = width;
        this.height = height;
        this.cell = new Cell(cell.column, cell.row);
        let defaultFrame = staticSprite.getTeamIndexOfFrame(staticSprite.ANIMATIONS.DEFAULT, teamIndex);
        this.sprite = game.add.sprite(this.cell.getCentreXPosition(),
                                        this.cell.getCentreYPosition(),
                                        staticSprite.IDENTIFIER,
                                        defaultFrame);
        this.sprite.width = PHASER.CELL.WIDTH * this.width;
        this.sprite.height = PHASER.CELL.HEIGHT * this.height;
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.sprite);
    }
    getAngle(direction) {
        switch (direction) {
        case MOVEMENT.NORTH:
            return 0;
        case MOVEMENT.NORTHEAST:
            return 45;
        case MOVEMENT.EAST:
            return 90;
        case MOVEMENT.SOUTHEAST:
            return 135;
        case MOVEMENT.SOUTH:
            return 180;
        case MOVEMENT.SOUTHWEST:
            return 225;
        case MOVEMENT.WEST:
            return 270;
        case MOVEMENT.NORTHWEST:
            return 315;
        }
        return 0;
    }
    setDirection(direction) {
        // Magic number to fix player sprite orientation; time consuming to fix sprite
        this.sprite.angle = this.getAngle(direction) + 135;
    }
    setCell(cell) {
        this.cell = cell;
        this.sprite.x = this.cell.getCentreXPosition();
        this.sprite.y = this.cell.getCentreYPosition();
    }
    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Sprite;
