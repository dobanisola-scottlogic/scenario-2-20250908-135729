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
    constructor($rootScope, $scope, $http, $interval, navigationBarService, gameService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$http = $http;
        this.$interval = $interval;
        this.navigationBarService = navigationBarService;
        this.gameService = gameService;

        this.credentials = {
            username: '',
            password: ''
        };

        this.gamesList = [];

        this.getGamesList();

        this.gamesListPolling = $interval(() => {
            this.getGamesList();
        }, 5000);
    }
    getGamesList() {
        this.gameService.getGames().then(response => {
            if (response && response.length) {
                this.gamesList = response;
            }
        });
    }
    selectGame(game) {
        this.gameService.getGame(game.id).then(response => {
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
        engine = new Engine(phaser, gameData);
    }
    login() {
        let credentials = this.$scope.credentials;
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
}

NavigationBarController.$inject = ['$rootScope', '$scope', '$http', '$interval', 'NavigationBarService', 'GameService'];

module.exports = NavigationBarController;
