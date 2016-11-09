class SharedPropertiesService {
    constructor($rootScope, milestoneBotPrefix) {
        this.milestoneBotPrefix = milestoneBotPrefix;
        this.$rootScope = $rootScope;
        this.engine = null;
        this.liveMode = null;
        this.endState = null;
        this.phaseIndex = null;
        this.gameOver = null;
        this.showGameGrid = false;
    }
    setEngine(engine) {
        this.engine = engine;
        this.$rootScope.$broadcast('engine:set', engine);
    }
    getEngine() {
        return this.engine;
    }
    setLiveMode(liveMode) {
        this.liveMode = liveMode;
        this.$rootScope.$broadcast('liveMode:set', liveMode);
    }
    getLiveMode() {
        return this.liveMode;
    }
    setSelectedGame(game) {
        this.selectedGame = game;
    }
    getSelectedGame() {
        return this.selectedGame;
    }
    setPhaseIndex(phaseIndex) {
        this.phaseIndex = phaseIndex;
        this.$rootScope.$broadcast('phaseIndex:changed', phaseIndex);
    }
    setGameOver(gameOver) {
        this.gameOver = gameOver;
    }
    getGameOver() {
        return this.gameOver;
    }
    onGameEnd() {
        this.setGameOver(true);
        this.$rootScope.$broadcast('gameOver');
    }
    getShowGameGrid() {
        return this.showGameGrid;
    }
    toggleShowGameGrid() {
        this.showGameGrid = !this.showGameGrid;
    }
}

SharedPropertiesService.$inject = ['$rootScope', 'MILESTONE_BOT_PREFIX'];

module.exports = SharedPropertiesService;
