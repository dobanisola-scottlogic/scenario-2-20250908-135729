require('pixi');
require('p2');
let parser = require('../../parser');
let phaser = require('phaser');
let Engine = require('../../engine/Engine.js');

const LOGIN_STATE = {
    NONE: 0,
    INPROGRESS: 1,
    AUTHOURIZED: 2,
    FAILED: 3
};

let engine;

class NavigationBarController {
    constructor($rootScope, $scope, $http, $interval, navigationBarService, gameService, hackathonService, sharedPropertiesService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$http = $http;
        this.$interval = $interval;
        this.navigationBarService = navigationBarService;
        this.gameService = gameService;
        this.hackathonService = hackathonService;
        this.sharedPropertiesService = sharedPropertiesService;

        this.credentials = {
            username: '',
            password: ''
        };

        this.invalidLogin = false;

        this.gamesList = [];

        this.teamList = [];

        this.sharedPropertiesService.setLiveMode(true);

        this.initialiseHackathons();
    }

    initialiseHackathons() {
        this.makingCall = true;
        this.hackathonService.getHackathonFromPath().then(
            hackathon => {
                this.selectedHackathon = hackathon;
                this.makingCall = false;
                this.getGamesList();
                this.$interval.cancel(this.gamesListPolling);
                this.gamesListPolling = this.$interval(() => {
                    this.getGamesList();
                }, 5000);
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
        engine = new Engine(phaser, gameData, this.sharedPropertiesService.getLiveMode());
        this.sharedPropertiesService.setEngine(engine);

        this.initialiseTeams(gameData);

    }
    initialiseTeams(gameData) {
        this.teamList = gameData.constants.teamInfo;
    }
    login() {
        this.state = LOGIN_STATE.INPROGRESS;

        this.navigationBarService.login(this.credentials.username, this.credentials.password).then(
            () => {
                this.state = LOGIN_STATE.AUTHOURIZED;
            },
            () => {
                this.state = LOGIN_STATE.FAILED;
            }
        );
    }
    logout() {
        this.navigationBarService.logout();
        this.state = this.state = LOGIN_STATE.NONE;
    }
    updateState() {
        this.state = LOGIN_STATE.NONE;
    }
    get isLoggedIn() {
        return this.state === LOGIN_STATE.AUTHOURIZED;
    }
    get isLoggingIn() {
        return this.state === LOGIN_STATE.INPROGRESS;
    }
    get isFailed() {
        return this.state === LOGIN_STATE.FAILED;
    }
    get loggedInUserName() {
        return this.navigationBarService.getLoggedInUserName();
    }
    get isAdmin() {
        return this.navigationBarService.getLoggedInUserName() === 'admin';
    }
    getColour(botId) {
        return {
            color: engine.getTeamColour(botId).HEX
        };
    }
}

NavigationBarController.$inject = ['$rootScope', '$scope', '$http', '$interval', 'NavigationBarService', 'GameService', 'HackathonService', 'SharedPropertiesService'];

module.exports = NavigationBarController;
