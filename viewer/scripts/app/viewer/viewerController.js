require('pixi');
require('p2');
let parser = require('../../parser');
let phaser = require('phaser');
let Engine = require('../../engine/Engine.js');

class ViewerController {
    constructor($scope, sharedPropertiesService) {
        this.$scope = $scope;
        this.sharedPropertiesService = sharedPropertiesService;
        this.hideControlsTimeout = null;
        this.isPlaying = true;
        this.isControlsVisible = false;
        this.mouseOverControls = false;
    }
    isLoaded() {
        return this.sharedPropertiesService.getEngine() !== null;
    }
    playToggleClick() {
        this.isPlaying = !this.isPlaying;
        this.sharedPropertiesService.getEngine().setPaused(!this.isPlaying);
    }
    mouseEnter() {
        this.isControlsVisible = true;
    }
    mouseLeave() {
        this.isControlsVisible = false;
    }
    mouseControlsEnter() {
        this.mouseOverControls = true;
    }
    mouseControlsLeave() {
        this.mouseOverControls = false;
    }
    mouseMove() {
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        } else {
            this.isControlsVisible = true;
        }
        if (!this.mouseOverControls) {
            this.hideControlsTimeout = setTimeout(() => {
                this.isControlsVisible = false;
                this.hideControlsTimeout = null;
            }, 1000);
        }
    }
    mouseDown() {
        return false;
    }
    setSpeedMultiplier(value) {
        this.sharedPropertiesService.getEngine().setSpeedMultiplier(value);
    }
    getSpeedMultiplier() {
        return this.sharedPropertiesService.getEngine().getSpeedMultiplier();
    }
    getSpeedMultipliers() {
        let engine = this.sharedPropertiesService.getEngine();
        return engine ? engine.getSpeedMultipliers() : [];
    }
    showLive() {
        return this.sharedPropertiesService.getLiveMode() && this.isPlaying && this.isLoaded();
    }
}

ViewerController.$inject = ['$scope', 'SharedPropertiesService'];

module.exports = ViewerController;
