
let PHASER = require('../enums/phaser.js');

let PhaserPreloader = require('./PhaserPreloader.js');
let PhaserCreator = require('./PhaserCreator.js');
let PhaserRenderer = require('./PhaserRenderer.js');
let PhaserUpdater = require('./PhaserUpdater.js');

let Map = require('./models/Map.js');

// Define engine constructor
class Engine {
    constructor(phaser, gameData) {

        // Save passed values
        this.gameData = gameData;

        // Construct phaser-game engine
        this.game = new phaser.Phaser.Game(
            gameData.constants.width * PHASER.CELL.WIDTH,
            gameData.constants.height * PHASER.CELL.HEIGHT,
            Phaser.AUTO,
            'phaserApp',
            {
                preload: new PhaserPreloader(this).preload,
                create: new PhaserCreator(this).create,
                render: new PhaserRenderer(this).render,
                update: new PhaserUpdater(this).update
            });

        // Construct map object
        this.map = new Map(this.gameData);

        // Define arrays to hold game objects
        this.collectables = [];
    }
    getPhaseCount() {
        return this.gameData.deltas.length;
    }
    getPhaseDelta(index) {
        return this.gameData.deltas[index];
    }
}

module.exports = Engine;
