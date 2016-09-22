class SharedPropertiesService {
    constructor() {
        this.engine = null;
        this.liveMode = null;
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
}

SharedPropertiesService.$inject = [];

module.exports = SharedPropertiesService;
