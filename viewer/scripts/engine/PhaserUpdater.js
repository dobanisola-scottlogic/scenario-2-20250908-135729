
let PHASER = require('../enums/phaser.js');
let MOVEMENT = require('../enums/movement.js');

let Collectable = require('./models/Collectable.js');
let Player = require('./models/Player.js');
let Cell = require('./models/Cell.js');

let cellShifter = require('./utils/CellShifter.js');

let ChartRenderer = require('../app/charts/ChartRenderer.js');

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
        this.chartRenderer = new ChartRenderer(engine);
        this.phaseIndex = 0;
        this.lastPhaseTime = new Date().getTime() - PHASER.PHASE_DELAY;
        this.update = this.update.bind(this);
    }
    update() {

        // Freeze the game if max phases reached
        if (this.phaseIndex === this.engine.getPhaseCount()) {
            this.setPaused(true);
        }

        // Control rate of phase updates, limiting to PHASE_DELAY
        if (new Date().getTime() - this.lastPhaseTime > PHASER.PHASE_DELAY &&
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

            this.chartRenderer.render();

            this.phaseIndex ++;
        }
    }
    setPaused(paused) {
        this.engine.collectables.forEach(collectable => {
            collectable.setPaused(paused);
        });
        this.engine.map.spawns.forEach(spawn => {
            spawn.setPaused(paused);
        });
        this.engine.players.forEach(player => {
            player.setPaused(paused);
        });
    }
    renderPhase(phase) {
        if (phase < this.engine.getPhaseCount()) {
            // Stop the update
            this.phaseIndex = this.engine.getPhaseCount();

            // Get the state at the requested phase
            let state = this.engine.getPhaseState(phase);

            // Create copies of the arrays so we don't change the original
            let stateSpawns = state.spawnPoints.slice();
            let stateCollectables = state.collectables.slice();
            let statePlayers = state.players.slice();

            // Remove items that aren't in this phase
            this.clearSuperfluousSpawns(stateSpawns);
            this.clearSuperfluousCollectables(stateCollectables);
            this.clearSuperfluousPlayers(statePlayers);

            // Add items that are in this phase
            this.engine.addSpawns(state.spawnPoints);
            this.addCollectables(state.collectables);
            this.addPlayers(state.players);
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

                this.engine.players[playerIndex].setTranslate(this.engine.game,
                                                              new Cell(column, row),
                                                              player.movement,
                                                              playerShift.columnShift,
                                                              playerShift.rowShift);
            } else {
                console.log('ERROR : Failed to move player[' + player.id + '].');
            }
        });
    }
    clearSuperfluousSpawns(stateSpawns) {
        let spawnPointIds = stateSpawns.map(spawnPoint => spawnPoint.id);

        this.engine.getCurrentSpawns().forEach(currentSpawn => {
            let index = spawnPointIds.indexOf(currentSpawn.id);

            if (index === -1) {
                currentSpawn.destroy();
            } else {
                stateSpawns.splice(index, 1);
            }
        });
    }
    clearSuperfluousCollectables(stateCollectables) {
        let collectableIds = stateCollectables.map(stateCollectable => stateCollectable.id);

        this.engine.collectables.forEach(currentCollectable => {
            let index = collectableIds.indexOf(currentCollectable.id);

            if (index === -1) {
                currentCollectable.destroy();
            } else {
                stateCollectables.splice(index, 1);
            }
        });
    }
    clearSuperfluousPlayers(statePlayers) {
        let playerIds = statePlayers.map(statePlayer => statePlayer.id);

        this.engine.players.forEach(currentPlayer => {
            let index = playerIds.indexOf(currentPlayer.id);

            if (index === -1) {
                currentPlayer.destroy();
            } else {
                currentPlayer.setCell(statePlayers[index].cell);

                if (currentPlayer.sprite.body) {
                    currentPlayer.sprite.body.velocity.setTo(0, 0);
                }

                statePlayers.splice(index, 1);
            }
        });
    }
}

module.exports = PhaserUpdater;
