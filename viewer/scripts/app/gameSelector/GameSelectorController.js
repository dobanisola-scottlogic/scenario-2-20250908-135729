require('pixi');
require('p2');
let parser = require('../../parser');
let phaser = require('phaser');
let Engine = require('../../engine/Engine.js');
const Maps = require('../maps/MapOptions');

let engine;

class GameSelectorController {
    constructor($rootScope, $scope, $http, $interval, gameService, hackathonService, sharedPropertiesService, uiGridConstants) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$http = $http;
        this.$interval = $interval;
        this.gameService = gameService;
        this.hackathonService = hackathonService;
        this.sharedPropertiesService = sharedPropertiesService;
        this.milestoneBotPrefix = sharedPropertiesService.milestoneBotPrefix;

        this.maps = Maps;

        this.selectGame = this.selectGame.bind(this);
        this.mapGame = this.mapGame.bind(this);

        this.gamesList = [];
        this.teamList = [];

        this.initialiseHackathon();
        this.initialiseGame();
        this.setupGameGrid(uiGridConstants);
    }

    setupGameGrid(uiGridConstants) {
        this.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name: 'Teams', field: 'name'},
                { field: 'map',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    condition: uiGridConstants.filter.EXACT,
                    selectOptions: this.maps.map(({ display, value }) => ({ label: display, value }))
                }
                },
                { name: 'Game Time', field: 'timeString', type: 'date'}
            ],
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            data: this.gamesList
        };

        let self = this;

        this.gridOptions.onRegisterApi = (gridApi) => {
            self.$scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(self.$scope, (row) => {
                this.sharedPropertiesService.setLiveMode(false);
                self.selectGame(row.entity);
            });
        };
    }

    showGrid() {
        return this.sharedPropertiesService.getShowGameGrid();
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
                    self.gameService.getGamesByHackathon(self.selectedHackathon.id).then(response => {
                        self.setGamesList(response);
                        if (self.sharedPropertiesService.getLiveMode()) {
                            self.selectMostRecentGame();
                        }
                    });
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

    initialiseGame() {
        this.makingCall = true;
        this.gameService.getGameFromPath().then(
            game => {
                this.makingCall = false;
                this.selectGame(this.mapGame(game));
            },
            () => {
                this.selectedGame = null;
                this.makingCall = false;
            }
        );
    }

    mapGame(game) {
        return {
            name: game.game.teams.map(team => {
                return team.teamName.replace(this.milestoneBotPrefix, '');
            }).sort(function(a, b) {
                let teamA = a.toUpperCase();
                let teamB = b.toUpperCase();
                let comparison = 0;
                if (teamA < teamB) {
                    comparison = -1;
                }
                if (teamA > teamB) {
                    comparison = 1;
                }
                return comparison;
            }).join(' vs '),
            map: game.game.map.name,
            timeString: new Date(game.game.gameTime).toUTCString(),
            time: game.game.gameTime,
            id: game.id
        };
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
            currGame.time > prevGame.time ? currGame : prevGame
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
        this.sharedPropertiesService.setLiveMode(true);

        // If latest game is already selected, restart it but now in live mode
        if (this.selectedGame && this.getLatestGame().id === this.selectedGame.id) {
            this.selectGame(this.selectedGame);
        } else {
            this.selectMostRecentGame();
        }
    }
    setGamesList(gamesList) {
        /*
         * sort by game time, i.e. latest game at the top, as this is the most common use case
         *
         * N.B. columns are sortable by default so users can always sort on any other column as needed
         */
        this.gamesList = (gamesList && gamesList.length)
            ? gamesList.map(this.mapGame).sort((a, b) => b.time - a.time)
            : [];
        this.gridOptions.data = this.gamesList;
    }
    selectGame(game) {
        this.gameService.getGame(game.id).then(response => {
            this.selectedGame = game;
            this.sharedPropertiesService.setSelectedGame(game);
            this.setGameQueryString(game.id);
            let parsedGameData = parser(response);
            this.playGame(parsedGameData);
        });
    }
    setGameQueryString(gameId) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('gameId', gameId);
        window.history.pushState({}, '', '?' + searchParams.toString());
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

GameSelectorController.$inject = ['$rootScope', '$scope', '$http', '$interval', 'GameService', 'HackathonService', 'SharedPropertiesService', 'uiGridConstants'];

module.exports = GameSelectorController;
