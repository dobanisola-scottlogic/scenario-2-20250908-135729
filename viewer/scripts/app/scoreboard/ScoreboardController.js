class ScoreboardController {
    constructor($rootScope, $scope, $http, $interval, sharedPropertiesService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$http = $http;
        this.$interval = $interval;
        this.sharedPropertiesService = sharedPropertiesService;
        this.milestoneBotPrefix = sharedPropertiesService.milestoneBotPrefix;
    }
    getMapName() {
        const selectedGame = this.sharedPropertiesService.getSelectedGame();
        return selectedGame ? selectedGame.map : '';
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
        return selectedGame ? selectedGame.time : null;
    }
}

ScoreboardController.$inject = ['$rootScope', '$scope', '$http', '$interval', 'SharedPropertiesService'];

module.exports = ScoreboardController;
