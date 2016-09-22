
let PHASER = require('../enums/phaser.js');
let COLOURS = require('../enums/colours.js');

let PhaserPreloader = require('./PhaserPreloader.js');
let PhaserCreator = require('./PhaserCreator.js');
let PhaserRenderer = require('./PhaserRenderer.js');
let PhaserUpdater = require('./PhaserUpdater.js');

let Map = require('./models/Map.js');
let Team = require('./models/Team.js');

// Define engine constructor
class Engine {
    constructor(phaser, gameData, looped) {

        // Save passed values
        this.gameData = gameData;

        this.teams = this.createTeams();

        // Create phaser method objects
        this.phaserPreloader = new PhaserPreloader(this);
        this.phaserCreator = new PhaserCreator(this);
        this.phaserRenderer = new PhaserRenderer(this);
        this.phaserUpdater = new PhaserUpdater(this);

        // Construct phaser-game engine
        this.game = new phaser.Phaser.Game(
            gameData.constants.width * PHASER.CELL.WIDTH,
            gameData.constants.height * PHASER.CELL.HEIGHT,
            Phaser.AUTO,
            'phaserApp',
            {
                preload: this.phaserPreloader.preload,
                create: this.phaserCreator.create,
                render: this.phaserRenderer.render,
                update: this.phaserUpdater.update
            });
        this.game.playbackSpeed = 1;

        // Construct map object
        this.map = new Map(this.getColumnCount(), this.getRowCount());

        // Define objects to hold game data
        this.collectables = [];
        this.players = [];
        this.paused = false;
        this.looped = looped;
        this.speed = {
            index: PHASER.SPEED.DEFAULT_INDEX,
            value: PHASER.SPEED.VALUES[PHASER.SPEED.DEFAULT_INDEX]
        };

    }
    createTeams() {
        let teams = {};

        let colours = [];
        for (let member in COLOURS.TEAM_COLOURS) {
            if (COLOURS.TEAM_COLOURS.hasOwnProperty(member)) {
                colours.push(COLOURS.TEAM_COLOURS[member]);
            }
        }

        this.gameData.constants.teamInfo.forEach((team, index) => {
            teams[team.botId] = new Team(team.teamId, team.teamName, colours[index]);
        });

        return teams;
    }
    getTeamColour(botId) {
        return this.teams[botId].getTeamColour();
    }
    getTeams() {
        return this.teams;
    }
    getPhaseCount() {
        return this.gameData.deltas.length;
    }
    getPhaseDelta(index) {
        return this.gameData.deltas[index];
    }
    getPhaseState(index) {
        return this.gameData.state[index];
    }
    getColumnCount() {
        return this.gameData.constants.width;
    }
    getRowCount() {
        return this.gameData.constants.height;
    }
    getOutOfBoundPositions() {
        return this.gameData.constants.outOfBoundPositions;
    }
    getSpawns() {
        return this.gameData.constants.spawnPoints;
    }
    getCurrentSpawns() {
        return this.map.spawns;
    }
    getPhaseTeamInfo(index) {
        return this.gameData.state[index].teamInfo;
    }
    renderPhase(phaseIndex, force) {
        this.phaserUpdater.renderPhase(phaseIndex, force);
    }
    addSpawns(spawns) {
        this.map.addSpawns(this.game, spawns, this.getTeams());
    }
    destroyAndCleanup() {
        this.game.input.enabled = false;
        this.game.cache.destroy();
        this.game.destroy();
        this.game = null;
    }
    setPaused(paused) {
        this.paused = paused;
        this.phaserUpdater.setPaused(paused);
    }
    isPaused() {
        return this.paused;
    }
    setLooped(looped) {
        this.looped = looped;
    }
    setSpeedIndex(speedIndex) {
        let phaseDelay = this.getSpeedValue();
        this.speed.index = Math.min(PHASER.SPEED.VALUES.length - 1, Math.max(0, speedIndex));
        this.speed.value = PHASER.SPEED.VALUES[this.speed.index];
        this.game.playbackSpeed = PHASER.SPEED.VALUES[PHASER.SPEED.DEFAULT_INDEX] / PHASER.SPEED.VALUES[this.speed.index];
        if (!this.paused) {
            this.phaserUpdater.updatePhaseDelay(phaseDelay, this.getSpeedValue());
        }
    }
    setSpeedMultiplier(speedMultiplier) {
        let requestedSpeed = PHASER.SPEED.VALUES[PHASER.SPEED.DEFAULT_INDEX] / speedMultiplier;
        PHASER.SPEED.VALUES.forEach((SPEED, index) => {
            if (requestedSpeed === SPEED) {
                this.setSpeedIndex(index);
            }
        });
    }
    getSpeedMultipliers() {
        let speeds = [];
        let defaultTime = PHASER.SPEED.VALUES[PHASER.SPEED.DEFAULT_INDEX];
        PHASER.SPEED.VALUES.forEach(value => {
            speeds.push(defaultTime / value);
        });
        return speeds;
    }
    getSpeedValue() {
        return this.speed.value;
    }
    getSpeedMultiplier() {
        return PHASER.SPEED.VALUES[PHASER.SPEED.DEFAULT_INDEX] / this.speed.value;
    }
}

module.exports = Engine;
