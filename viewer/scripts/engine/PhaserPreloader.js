
let PHASER = require('../enums/phaser.js');
let SPRITE = require('../enums/sprite.js');

/*
 * Phaser Preload function:
 *
 * First function called in the phaser engine pipeline.
 * Used to link assets to phaser image objects.
 * Image objects are defined by constants found in PHASER.
 *
 */
class PhaserPreloader {
    constructor(engine) {
        this.engine = engine;
        this.preload = this.preload.bind(this);
    }
    preload() {
        this.loadSpriteSheet(SPRITE.MAP);
        this.loadSpriteSheet(SPRITE.PLAYER);
        this.loadSpriteSheet(SPRITE.SPAWN);
        this.loadSpriteSheet(SPRITE.COLLECTABLE);
    }
    loadSpriteSheet(params) {
        this.engine.game.load.spritesheet(params.IDENTIFIER,
                                          params.FILE_PATH,
                                          params.WIDTH,
                                          params.HEIGHT,
                                          params.TILE_COUNT);
    }
}

module.exports = PhaserPreloader;
