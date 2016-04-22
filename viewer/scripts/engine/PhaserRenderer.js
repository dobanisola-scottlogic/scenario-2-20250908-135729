
let PHASER = require('../enums/phaser.js');

/*
 * Phaser Render function:
 *
 * Used to draw simple graphics onto the screen.
 * Called every loop before the phaser update function.
 *
 */
class PhaserRenderer {
    constructor(engine) {
        this.engine = engine;
        this.render = this.render.bind(this);
    }
    render() {

    }
}

module.exports = PhaserRenderer;
