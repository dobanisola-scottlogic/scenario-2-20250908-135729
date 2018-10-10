const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');
const Maps = require('../maps/MapOptions');

class GamePanelController {
    constructor($scope, $rootScope, teamService, gameService, milestoneService, hackathonService, milestoneBotPrefix) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.teamService = teamService;
        this.hackathonService = hackathonService;
        this.gameService = gameService;
        this.milestoneService = milestoneService;
        this.milestoneBotPrefix = milestoneBotPrefix;

        this.maps = Maps;

        this.teams = [];
        this.hackathons = [];
        this.milestoneTeams = [];

        this.currentMilestone = '';

        this.game = {
            map: this.maps.find(map => { return map.isDefault; }).value,
            teams: [],
            hackathonId: ''
        };

        this.initialiseWatchers();
        this.initialiseHackathons();
    }

    initialiseWatchers() {
        let self = this;
        this.$scope.$on('team:created', function(event, data) {
            self.refreshTeams();
        });
        this.$scope.$on('hackathon:created', function(event, data) {
            self.refreshHackathons();
        });
        this.$scope.$on('hackathon:updated', function(event, data) {
            self.initialiseHackathons();
        });
    }

    refreshAlerts() {
        this.alert = null;
    }

    refreshTeams() {
        this.makingCall = true;

        this.teamService.getTeamsByHackathon(this.game.hackathonId).then(
            newTeams => {
                this.teams = newTeams;
                this.milestoneTeams = [];
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
            },
            () => {
                this.teams = [];
                this.makingCall = false;
            }
        );
    }

    onTeamSelected(team) {
        var index = this.game.teams.indexOf(team.name);
        if (index === -1) {
            this.game.teams.push(team.name);
        } else {
            this.game.teams.splice(index, 1);
        }
    }

    initialiseHackathons() {
        this.makingCall = true;
        this.hackathonService.getHackathonFromPath().then(
            hackathon => {
                this.selectedHackathon = hackathon;
                this.game.hackathonId = hackathon.id;
                this.currentMilestone = hackathon.currentMilestoneClassName;
                this.refreshTeams();
                this.makingCall = false;
            },
            () => {
                this.makingCall = false;
            }
         );
        this.refreshHackathons();
    }

    refreshHackathons() {
        this.makingCall = true;

        this.hackathons = [];

        this.hackathonService.getHackathons().then(
            newHackathons => {
                this.hackathons = newHackathons;
                this.makingCall = false;
            },
            () => {
                this.hackathons = [];
                this.makingCall = false;
            }
        );
    }

    onHackathonSelected() {
        if (this.selectedHackathon) {
            this.game.hackathonId = this.selectedHackathon.id;
            this.currentMilestone = this.selectedHackathon.currentMilestoneClassName;
            this.refreshTeams();
        }
    }

    playAgainstCurrentMilestone() {
        this.game.teams.push(this.selectedHackathon.currentMilestoneClassName);
        this.playGame();
    }

    playGame() {
        this.makingCall = true;

        this.gameService.playGame(this.game).then(
            success => {
                this.$rootScope.$broadcast('game:created', this.game);
                this.game.map = this.maps.find(map => { return map.isDefault; }).value;
                this.game.teams = [];
                this.makingCall = false;
                this.alert = Success;
            },
            error => {
                this.game.teams = [];
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    isTeamSelected(team) {
        return this.game.teams.indexOf(team.name) !== -1;
    }

    isHackathonSelected(hackathon) {
        return this.game.hackathonId && this.game.hackathonId === hackathon.id;
    }

    isCurrentMilestone(milestone) {
        return this.currentMilestone && this.currentMilestone === milestone;
    }

    isButtonDisabled(minTeams) {
        return (this.game.map.length === 0) || (this.game.teams.length < minTeams) || this.userInterfaceDisabled;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }
}

GamePanelController.$inject = ['$scope', '$rootScope', 'TeamService', 'GameService', 'MilestoneService', 'HackathonService', 'MILESTONE_BOT_PREFIX'];

module.exports = GamePanelController;
