
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');
let Sprite = require('./Sprite.js');

class Spawn {
    constructor(game, id, owner, colour, cell) {
        this.id = id;
        this.owner = owner;
        this.colour = colour;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = new Sprite(game,
                                SPRITE.SPAWN,
                                3,
                                3,
                                this.cell,
                                this.colour);
        sprite.addAnimation('active');
        sprite.addAnimation('die');
        sprite.playAnimation('active');
        return sprite;
    }
    setPaused(paused, resumeSpeed) {
        this.sprite.setPaused(paused, resumeSpeed);
    }
    adjustPlaybackSpeed(phaseDelay, newPhaseDelay) {
        this.sprite.adjustPlaybackSpeed(phaseDelay, newPhaseDelay);
    }
    destroy(playDeathAnimation, leavePhaserSprite) {
        this.sprite.destroy(playDeathAnimation, leavePhaserSprite);
    }
}

module.exports = Spawn;
