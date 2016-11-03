const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class TeamPanelController {
    constructor($scope, $rootScope, teamService, hackathonService, botService) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.teamService = teamService;
        this.hackathonService = hackathonService;
        this.botService = botService;

        this.teams = [];
        this.hackathons = [];

        this.currentTeamBots = [];
        this.activeBots = [];

        this.newTeamDetails = {
            name: '',
            password: '',
            hackathonId: ''
        };

        this.updatePassword = '';

        this.initialiseWatchers();
        this.initialiseHackathons();
    }

    initialiseWatchers() {
        let self = this;
        this.$scope.$on('hackathon:created', function(event, data) {
            self.refreshHackathons();
        });
    }

    refreshAlerts() {
        this.alert = null;
    }

    refreshTeams() {
        this.makingCall = true;

        this.teamService.getTeamsByHackathon(this.newTeamDetails.hackathonId).then(
            newTeams => {
                this.teams = newTeams;
                this.makingCall = false;
            },
            () => {
                this.teams = [];
                this.makingCall = false;
            }
        );
    }

    onBotUpload(bot) {
        this.refreshBots();
    }

    refreshBots() {
        this.makingCall = true;

        this.botService.getBotsByTeamName(this.selectedTeam.name).then(
            currentTeamBots => {
                this.currentTeamBots = currentTeamBots;
                this.activeBots = currentTeamBots.filter(bot => bot.active);
                this.makingCall = false;
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    onTeamSelected(selectedTeam) {
        this.selectedTeam = selectedTeam;
        this.selectedBot = null;
        this.refreshBots();
    }

    isActive(bot) {
        return this.activeBots && this.activeBots.some(activeBot => activeBot.id === bot.id);
    }

    initialiseHackathons() {
        this.makingCall = true;
        this.hackathonService.getHackathonFromPath().then(
            hackathon => {
                this.selectedHackathon = hackathon;
                this.newTeamDetails.hackathonId = hackathon.id;
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
        this.selectedTeam = null;
        this.selectedBot = null;
        this.teams = [];
        this.currentTeamBots = [];
        this.refreshTeams();
    }

    onDelete() {
        this.refreshAlerts();
        this.teamService.deleteTeam(this.selectedTeam).then(
            () => {
                this.selectedTeam = undefined;
                this.refreshTeams();
            },
            () => {
                this.alert = Error;
            }
        );
    }

    onUpdatePassword() {
        this.makingCall = true;
        this.refreshAlerts();
        this.teamService.updatePassword(this.selectedTeam, this.updatePassword).then(
            success => {
                this.updatePassword = '';
                this.selectedTeam = null;
                this.makingCall = false;
                this.alert = Success;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            });
    }

    addNewTeam() {
        this.makingCall = true;
        this.refreshAlerts();
        this.teamService.addTeam(this.newTeamDetails).then(
            success => {
                this.$rootScope.$broadcast('team:created', this.newTeamDetails);
                this.newTeamDetails.name = '';
                this.newTeamDetails.password = '';
                this.refreshTeams();
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    isSelected(team) {
        return this.selectedTeam && this.selectedTeam.id === team.id;
    }

    onBotSelected(bot) {
        this.selectedBot = bot;
    }

    isBotSelected(bot) {
        return this.selectedBot && this.selectedBot.id === bot.id;
    }

    onBotDelete() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.deleteBot(this.selectedBot).then(
            () => {
                this.selectedBot = undefined;
                this.refreshBots();
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    onMakeActive() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.makeActive(this.selectedBot).then(
            () => {
                this.refreshBots();
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    get addButtonDisabled() {
        return (this.newTeamDetails.name.length === 0) ||
        (this.newTeamDetails.password.length === 0) ||
        (this.newTeamDetails.hackathonId.length === 0) ||
        this.userInterfaceDisabled;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }

    get updatePasswordButtonDisabled() {
        return this.updatePassword.length === 0 ||
        !this.selectedTeam ||
        this.userInterfaceDisabled;
    }

    get deleteButtonDisabled() {
        return this.userInterfaceDisabled || !this.selectedTeam;
    }

    get selectFileDisabled() {
        return this.userInterfaceDisabled || !this.selectedTeam;
    }

    get editButtonsDisabled() {
        return this.userInterfaceDisabled || !this.selectedBot;
    }
}

TeamPanelController.$inject = ['$scope', '$rootScope', 'TeamService', 'HackathonService', 'BotService'];

module.exports = TeamPanelController;
