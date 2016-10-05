class ScoreboardController {
    constructor($rootScope, $scope, $http, $interval, sharedPropertiesService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$http = $http;
        this.$interval = $interval;
        this.sharedPropertiesService = sharedPropertiesService;
    }
    getMapName() {
        const selectedGame = this.sharedPropertiesService.getSelectedGame();
        return selectedGame ? selectedGame.game.map.name : '';
    }
    getTeams() {
        const engine = this.sharedPropertiesService.getEngine();
        return engine ? engine.getTeams() : [];
    }
    getColour(colour) {
        return {
            'background-color': colour
        };
    }
    getGameTime() {
        const selectedGame = this.sharedPropertiesService.getSelectedGame();
        return selectedGame ? selectedGame.game.gameTime : null;
    }
}

ScoreboardController.$inject = ['$rootScope', '$scope', '$http', '$interval', 'SharedPropertiesService'];

module.exports = ScoreboardController;
