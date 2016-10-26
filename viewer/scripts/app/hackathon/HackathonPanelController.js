const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');
const Maps = require('../maps/MapOptions');

class HackathonPanelController {
    constructor($scope, $rootScope, hackathonService, milestoneService, milestoneBotPrefix) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.hackathonService = hackathonService;
        this.milestoneService = milestoneService;
        this.milestoneBotPrefix = milestoneBotPrefix;

        this.hackathon = {
            name: ''
        };

        this.maps = Maps;

        this.hackathons = [];
        this.milestoneTeams = [];

        this.refreshHackathons();
        this.refreshMilestones();
    }

    createHackathon() {
        this.makingCall = true;
        this.hackathonService.createHackathon(this.hackathon).then(
            success => {
                this.$rootScope.$broadcast('hackathon:created');
                this.hackathon.name = '';
                this.refreshHackathons();
                this.makingCall = false;
            },
            error => {
                this.makingCall = false;
                this.alert = Error;
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    refreshHackathons() {
        this.makingCall = true;

        this.hackathonService.getHackathons().then(
            newHackathons => {
                this.hackathons = newHackathons;
                this.makingCall = false;
            },
            () => {
                this.hackathons = [];
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    refreshMilestones() {
        this.makingCall = true;
        this.milestoneService.getMilestones().then(activeMilestones => {
            if (activeMilestones && activeMilestones.length) {
                const milestoneNames = activeMilestones.map(milestone => {
                    return {name: milestone.milestoneClassName.replace('.class', '')};
                });
                this.milestoneTeams.push(...milestoneNames);
            }
            this.makingCall = false;
        },
        () => {
            this.makingCall = false;
        });
    }

    onHackathonSelected(selectedHackathon) {
        this.selectedHackathon = selectedHackathon;
    }

    isSelected(hackathon) {
        return this.selectedHackathon && this.selectedHackathon.id === hackathon.id;
    }

    onUpdate() {
        this.makingCall = true;
        let milestoneUpdate = {
            milestoneClassName: this.selectedHackathon.currentMilestoneClassName,
            milestoneMap: this.selectedHackathon.currentMilestoneMap
        };
        this.hackathonService.updateCurrentMilestone(this.selectedHackathon, milestoneUpdate).then(
            success => {
                this.$rootScope.$broadcast('hackathon:updated');
                this.makingCall = false;
                this.alert = Success;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    onDelete() {
        if (window.confirm('Are you sure? This will also delete all teams and games associated with the hackathon: ' + this.selectedHackathon.name)) {
            this.makingCall = true;
            this.hackathonService.deleteHackathon(this.selectedHackathon).then(
                () => {
                    this.selectedHackathon = undefined;
                    this.refreshHackathons();
                    this.makingCall = false;
                },
                () => {
                    this.makingCall = false;
                    this.alert = Error;
                }
            );
        }
    }

    get addButtonDisabled() {
        return (this.hackathon.name.length === 0) || this.userInterfaceDisabled;
    }

    get updateButtonDisabled() {
        return !this.selectedHackathon || this.userInterfaceDisabled;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }

    refreshAlerts() {
        this.alert = null;
    }
}

HackathonPanelController.$inject = ['$scope', '$rootScope', 'HackathonService', 'MilestoneService', 'MILESTONE_BOT_PREFIX'];

module.exports = HackathonPanelController;
