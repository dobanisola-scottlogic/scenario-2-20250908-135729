
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
    constructor(engine, sharedPropertiesService) {
        this.engine = engine;
        this.sharedPropertiesService = sharedPropertiesService;
        this.phaseIndex = 0;
        this.lastPhaseTime = new Date().getTime() - PHASER.SPEED.VALUES[PHASER.SPEED.DEFAULT_INDEX];
        this.update = this.update.bind(this);
    }
    update() {
        // Freeze/loop the game if max phases reached
        if (this.phaseIndex === this.engine.getPhaseCount()) {
            if (this.engine.looped) {
                this.sharedPropertiesService.setGameOver(false);
                this.renderPhase(0, true);
            } else {
                this.setPaused(true);
                this.sharedPropertiesService.onGameEnd();
            }
        }
        else {
            this.sharedPropertiesService.setGameOver(false);
        }

        // Control rate of phase updates, limiting to PHASE_DELAY
        if (new Date().getTime() - this.lastPhaseTime > this.engine.getSpeedValue() &&
            this.phaseIndex < this.engine.getPhaseCount() &&
            !this.engine.isPaused()) {

            this.lastPhaseTime = (new Date()).getTime();

            let deltaPhase = this.engine.getPhaseDelta(this.phaseIndex);

            this.addCollectables(deltaPhase.collectablesAdded);
            this.destroyCollectables(deltaPhase.collectablesCollected);

            this.destroySpawns(deltaPhase.spawnPointsDestroyed);

            this.addPlayers(deltaPhase.playersAdded);
            this.destroyPlayers(deltaPhase.playersDestroyed);
            this.movePlayers(deltaPhase.playerMovement);

            this.sharedPropertiesService.setPhaseIndex(this.phaseIndex);

            this.phaseIndex ++;
        }
    }
    setPaused(paused) {
        this.engine.collectables.forEach(collectable => {
            collectable.setPaused(paused, this.engine.getSpeedValue());
        });
        this.engine.map.spawns.forEach(spawn => {
            spawn.setPaused(paused, this.engine.getSpeedValue());
        });
        this.engine.players.forEach(player => {
            player.setPaused(paused, this.engine.getSpeedValue());
        });
    }
    updatePhaseDelay(phaseDelay, newPhaseDelay) {
        this.engine.collectables.forEach(collectable => {
            collectable.adjustPlaybackSpeed(phaseDelay, newPhaseDelay);
        });
        this.engine.map.spawns.forEach(spawn => {
            spawn.adjustPlaybackSpeed(phaseDelay, newPhaseDelay);
        });
        this.engine.players.forEach(player => {
            player.adjustVelocity(phaseDelay, newPhaseDelay);
            player.adjustPlaybackSpeed(phaseDelay, newPhaseDelay);
        });
    }
    renderPhase(phase, force) {
        if (phase < this.engine.getPhaseCount() || force) {
            if (new Date().getTime() - this.lastPhaseTime > PHASER.PHASE_DELAY || force) {

                this.lastPhaseTime = new Date().getTime();

                // Get the state at the requested phase
                let state = this.engine.getPhaseState(phase);

                // Create copies of the arrays so we don't change the original
                let stateSpawns = state.spawnPoints.slice();
                let stateCollectables = state.collectables.slice();
                let statePlayers = state.players.slice();

                // Remove all the phase
                this.engine.players.forEach(player => {
                    player.destroy(false, false);
                });
                this.engine.map.spawns.forEach(spawn => {
                    spawn.destroy(false, false);
                });
                this.engine.collectables.forEach(collectable => {
                    collectable.destroy(false, false);
                });
                this.engine.players = [];
                this.engine.map.spawns = [];
                this.engine.collectables = [];

                // Add items that are in this phase
                this.engine.addSpawns(stateSpawns);
                this.addCollectables(stateCollectables);
                this.addPlayers(statePlayers);

                if (force) {
                    this.phaseIndex = phase + 1;
                }
            }
        } else {
            console.log('ERROR : Attempted to render a phase outside of the game phase bounds. Max phase:', this.engine.getPhaseCount() - 1);
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
            if (collectableIndex !== -1) {
                this.engine.collectables[collectableIndex].destroy(true);
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
                                                    this.engine.getTeamColour(player.owner),
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
                this.engine.players[playerIndex].destroy(true);
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

                this.engine.players[playerIndex].setTranslate(this.engine.getSpeedValue(),
                                                              new Cell(column, row),
                                                              player.movement,
                                                              playerShift.columnShift,
                                                              playerShift.rowShift);
            } else {
                console.log('ERROR : Failed to move player[' + player.id + '].');
            }
        });
    }
}

module.exports = PhaserUpdater;
