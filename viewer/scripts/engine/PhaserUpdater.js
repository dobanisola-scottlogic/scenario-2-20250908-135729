
let PHASER = require('../enums/phaser.js');

let Collectable = require('./models/Collectable.js');

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
        this.phaseIndex = 0;
        this.lastPhaseTime = new Date().getTime() - PHASER.PHASE_DELAY;
        this.update = this.update.bind(this);
    }
    update() {

        // Control rate of phase updates, limiting to PHASE_DELAY
        if (new Date().getTime() - this.lastPhaseTime > PHASER.PHASE_DELAY &&
            this.phaseIndex < this.engine.getPhaseCount()) {

            this.lastPhaseTime = (new Date()).getTime();

            let deltaPhase = this.engine.getPhaseDelta(this.phaseIndex);

            this.addCollectables(deltaPhase.collectablesAdded);
            this.destroyCollectables(deltaPhase.collectablesCollected);

            this.destroySpawns(deltaPhase.spawnPointsDestroyed);

            this.phaseIndex ++;
        }
    }
    addCollectables(addedCollectables) {
        addedCollectables.forEach(collectable => {
            let newCollectable = new Collectable(this.engine.game,
                                                 collectable.id,
                                                 collectable.type,
                                                 collectable.position);
            this.engine.collectables.push(newCollectable);
        });
    }
    destroyCollectables(destroyedCollectables) {
        destroyedCollectables.forEach(collectable => {
            let collectableIndex = this.engine.collectables.map(gameCollectable => gameCollectable.id)
                                                           .indexOf(collectable.id);
            if (collectableIndex) {
                this.engine.collectables[collectableIndex].destroy();
                this.engine.collectables.splice(collectableIndex, 1);
            } else {
                console.log('ERROR : Failed to destroy collectable[' + collectable.id + '].');
            }
        });
    }
    destroySpawns(destroyedSpawns) {
        destroyedSpawns.forEach(spawn => {
            this.engine.map.destroySpawn(spawn.id);
        });
    }
}

module.exports = PhaserUpdater;
