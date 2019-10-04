const AlertTypes = require('../alert/AlertTypes');
let parser = require('../../parser');
let phaser = require('phaser');
let Engine = require('../../engine/Engine.js');
const Maps = require('../maps/MapOptions');

let engine;

class RemotePanelController {
    constructor($scope, $interval, remoteService, loginService, sharedPropertiesService, milestoneService, milestoneBotPrefix) {
        this.$scope = $scope;
        this.$interval = $interval;
        this.remoteService = remoteService;
        this.loginService = loginService;
        this.sharedPropertiesService = sharedPropertiesService;
        this.milestoneService = milestoneService;
        this.milestoneBotPrefix = milestoneBotPrefix;
        this.teamName = this.loginService.getLoggedInUserName();
        this.maps = Maps;
        this.selectedMap = this.maps.find(map => { return map.isDefault; }).value;

        this.milestoneTeams = [];
        this.selectedMilestone = '';
        this.$scope.connected = '';
        this.updateConnection();
        this.initialiseConnectionPolling();
        this.loadMilestones();

        this.$scope.$on('$destroy', () => {
            this.$interval.cancel(this.connectionPolling);
        });
    }

    updateConnection() {
        if (this.teamName !== 'admin') {
            this.remoteService.getConnectedState(this.teamName).then(
                response => {
                    this.$scope.connected = response;
                }
            );
        }
    }

    initialiseConnectionPolling() {
        this.$interval.cancel(this.connectionPolling);
        this.connectionPolling = this.$interval(() => {
            this.updateConnection();
        }, 1000);
    }

    onConnect() {
        this.$interval.cancel(this.connectionPolling);
        this.$scope.connected = 'WAITING';
        this.remoteService.connect(this.teamName).then(
            () => {
                this.updateConnection();
                this.initialiseConnectionPolling();
            },
            () => {
                this.alert = {
                    type: AlertTypes.ERROR,
                    message: 'Failed to connect'
                };
                this.$scope.connected = '';
                this.initialiseConnectionPolling();
            }
        );
    }

    onDisconnect() {
        this.$interval.cancel(this.connectionPolling);
        this.$scope.connected = 'WAITING';
        this.remoteService.disconnect(this.teamName).then(
            () => {
                this.updateConnection();
                this.initialiseConnectionPolling();
            },
            () => {
                this.alert = {
                    type: AlertTypes.ERROR,
                    message: 'Failed to disconnect'
                };
                this.$scope.connected = '';
                this.initialiseConnectionPolling();
            }
        );
    }

    onTest() {
        this.testing = true;
        this.remoteService.test(this.teamName, this.selectedMilestone, this.selectedMap).then(
            (gameData) => {
                this.sharedPropertiesService.setSelectedGame(gameData.id);
                // Destroy previous engine
                engine = this.sharedPropertiesService.getEngine();
                if (engine) {
                    engine.destroyAndCleanup();
                }

                // Construct phaser engine
                engine = new Engine(phaser, parser(gameData), this.sharedPropertiesService.getLiveMode(), this.sharedPropertiesService);
                this.sharedPropertiesService.setEngine(engine);
                this.testing = false;
            },
            () => {
                this.alert = {
                    type: AlertTypes.ERROR,
                    message: 'Failed to run test game'
                };
                this.testing = false;
            }
        );
    }

    loadMilestones() {
        this.milestoneTeams = [];
        this.milestoneService.getMilestones().then(activeMilestones => {
            if (activeMilestones && activeMilestones.length) {
                const milestoneNames = activeMilestones.map(milestone => {
                    return milestone.milestoneClassName.replace(this.milestoneBotPrefix, '');
                });
                this.milestoneTeams.push(...milestoneNames);
            }
            this.makingCall = false;
        },
        () => {
            this.makingCall = false;
        });
    }

    onMilestoneSelected(milestone) {
        this.selectedMilestone = milestone;
    }

    isMilestoneSelected(milestone) {
        return this.selectedMilestone === milestone;
    }

    playGame() {
    }

    refreshAlerts() {
        this.alert = null;
    }

    get showStatus() {
        return this.$scope.connected !== '';
    }

    get isConnected() {
        return this.$scope.connected === 'CONNECTED';
    }

    get isTestable() {
        return this.$scope.connected === 'CONNECTED' && this.selectedMilestone;
    }

    get isTesting() {
        return this.testing === true;
    }
}

RemotePanelController.$inject = ['$scope', '$interval', 'RemoteService', 'LoginService', 'SharedPropertiesService', 'MilestoneService', 'MILESTONE_BOT_PREFIX'];

module.exports = RemotePanelController;
