require('pixi');
require('p2');
let parser = require('../../parser');
let phaser = require('phaser');
let Engine = require('../../engine/Engine.js');

let engine;

class GameSelectorController {
    constructor($rootScope, $scope, $http, $interval, gameService, hackathonService, sharedPropertiesService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$http = $http;
        this.$interval = $interval;
        this.gameService = gameService;
        this.hackathonService = hackathonService;
        this.sharedPropertiesService = sharedPropertiesService;
        this.milestoneBotPrefix = sharedPropertiesService.milestoneBotPrefix;

        this.gamesList = [];

        this.teamList = [];

        this.sharedPropertiesService.setLiveMode(true);

        this.initialiseHackathon();
    }

    initialiseHackathon() {
        this.makingCall = true;
        this.hackathonService.getHackathonFromPath().then(
            hackathon => {
                this.selectedHackathon = hackathon;
                this.makingCall = false;
                this.getGamesList();
                let self = this;
                this.$scope.$on('game:created', function(event, data) {
                    self.getGamesList();
                });
                this.$interval.cancel(this.gamesListPolling);
                this.gamesListPolling = this.$interval(() => {
                    this.getGamesList();
                }, 30000);
            },
            () => {
                this.selectedHackathon = null;
                this.makingCall = false;
            }
        );
    }

    getGamesList() {
        if (this.selectedHackathon.id) {
            this.gameService.getGamesByHackathon(this.selectedHackathon.id).then(response => {
                this.setGamesList(response);
            });
        }
    }
    getLatestGame() {
        return this.gamesList.reduce((prevGame, currGame) => (
            currGame.game.gameTime > prevGame.game.gameTime ? currGame : prevGame
        ));
    }
    selectMostRecentGame() {
        if (this.gamesList.length) {
            const nextGame = this.getLatestGame();

            if (!this.selectedGame || nextGame.id !== this.selectedGame.id) {
                this.selectGame(nextGame);
            }
        }
    }
    enableLiveMode() {
        if (!this.sharedPropertiesService.getLiveMode()) {
            this.sharedPropertiesService.setLiveMode(true);

            // If latest game is already selected, restart it but now in live mode
            if (this.getLatestGame().id === this.selectedGame.id) {
                this.selectGame(this.selectedGame);
            } else {
                this.selectMostRecentGame();
            }
        }
    }
    setGamesList(gamesList) {
        if (gamesList && gamesList.length) {
            this.gamesList = gamesList;
        }
    }
    gameSelectedInDropdown(game) {
        this.sharedPropertiesService.setLiveMode(false);
        this.selectGame(game);
    }
    selectGame(game) {
        this.gameService.getGame(game.id).then(response => {
            this.selectedGame = game;
            this.sharedPropertiesService.setSelectedGame(game);
            let parsedGameData = parser(response);
            this.playGame(parsedGameData);
        });
    }
    playGame(gameData) {
        // Destroy previous engine
        if (engine) {
            engine.destroyAndCleanup();
        }

        // Construct phaser engine
        engine = new Engine(phaser, gameData, this.sharedPropertiesService.getLiveMode(), this.sharedPropertiesService);
        this.sharedPropertiesService.setEngine(engine);
        this.initialiseTeams(gameData);
    }
    initialiseTeams(gameData) {
        this.teamList = gameData.constants.teamInfo;
    }
    getColour(botId) {
        return {
            color: engine.getTeamColour(botId).HEX
        };
    }
}

GameSelectorController.$inject = ['$rootScope', '$scope', '$http', '$interval', 'GameService', 'HackathonService', 'SharedPropertiesService'];

module.exports = GameSelectorController;
