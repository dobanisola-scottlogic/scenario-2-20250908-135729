
// Import constants
let PHASER = require('../enums/phaser.js');

/*
 * Phaser Update function:
 *
 * Called in a loop at a frequency in keeping with the specifiedd FPS.
 * The bulk of main game execution is performed here.
 * To allow sprite animation;
 *  - frame time will be based on the phaser timings
 *  - phaser time will be calculated ourselves
 *
 */
class PhaserUpdater {
    constructor(engine) {
        this.engine = engine;
        this.update = this.update.bind(this);
    }
    update() {

    }
}

module.exports = PhaserUpdater;
