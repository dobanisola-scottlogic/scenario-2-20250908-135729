
let PHASER = require('../enums/phaser.js');
let SPRITE = require('../enums/sprite.js');

/*
 * Phaser Create function:
 *
 * Called after preload.
 * Common sprite objects are created here.
 * Initialisation of settings are done here.
 *
 */
class PhaserCreator {
    constructor(engine) {
        this.engine = engine;
        this.create = this.create.bind(this);
    }
    create() {
        this.engine.map.create(this.engine.game);
    }
}


module.exports = PhaserCreator;
