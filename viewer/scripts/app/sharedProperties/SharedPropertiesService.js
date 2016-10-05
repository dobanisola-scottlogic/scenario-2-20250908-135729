class SharedPropertiesService {
    constructor() {
        this.engine = null;
        this.liveMode = null;
        this.endState = null;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    getEngine() {
        return this.engine;
    }
    setLiveMode(liveMode) {
        this.liveMode = liveMode;
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
    getGameOver() {
        let gameOver = this.engine && this.engine.getGameOver();
        if (gameOver && this.endState !== this.engine.gameEndState) {
            this.endState = this.engine.gameEndState;
        }
        return gameOver;
    }
}

SharedPropertiesService.$inject = [];

module.exports = SharedPropertiesService;
