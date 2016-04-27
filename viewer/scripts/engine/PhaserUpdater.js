
let PHASER = require('../enums/phaser.js');
let MOVEMENT = require('../enums/movement.js');

let Collectable = require('./models/Collectable.js');
let Player = require('./models/Player.js');
let Cell = require('./models/Cell.js');

let cellShifter = require('./utils/CellShifter.js');

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

            this.addPlayers(deltaPhase.playersAdded);
            this.destroyPlayers(deltaPhase.playersDestroyed);
            this.movePlayers(deltaPhase.playerMovement);

            this.phaseIndex ++;
        }
    }
    addCollectables(addedCollectables) {
        addedCollectables.forEach(collectable => {
            let newCollectable = new Collectable(this.engine.game,
                                                 collectable.id,
                                                 collectable.type,
                                                 collectable.cell);
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
    addPlayers(addedPlayers) {
        addedPlayers.forEach(player => {
            if (player.owner && player.teamIndex !== -1) {
                this.engine.players.push(new Player(this.engine.game,
                                                    player.id,
                                                    player.owner,
                                                    player.teamIndex,
                                                    player.cell));
            } else {
                console.log('ERROR : Attempted to create player[' + player.id + '] without a matching owner.');
            }
        });
    }
    destroyPlayers(destroyedPlayers) {
        destroyedPlayers.forEach(player => {
            let playerIndex = this.engine.players.map(currentPlayer => currentPlayer.id)
                                                 .indexOf(player.id);
            if (playerIndex !== -1) {
                this.engine.players[playerIndex].destroy();
                this.engine.players.splice(playerIndex, 1);
            } else {
                console.log('ERROR : Failed to destroy player[' + player.id + '].');
            }
        });
    }
    movePlayers(movedPlayers) {
        movedPlayers.forEach(player => {
            let playerIndex = this.engine.players.map(currentPlayer => currentPlayer.id)
                                                 .indexOf(player.id);
            if (playerIndex !== -1) {
                let playerCell = this.engine.players[playerIndex].cell;
                let playerShift = cellShifter.getCellShift(player.movement);
                let column = cellShifter.wrap((playerCell.column + playerShift.columnShift), this.engine.getColumnCount());
                let row = cellShifter.wrap((playerCell.row + playerShift.rowShift), this.engine.getRowCount());

                this.engine.players[playerIndex].setCell(new Cell(column, row), player.movement);
            } else {
                console.log('ERROR : Failed to move player[' + player.id + '].');
            }
        });
    }
}

module.exports = PhaserUpdater;
