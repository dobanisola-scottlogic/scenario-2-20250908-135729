const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class TeamPanelController {
    constructor($scope, teamService, hackathonService) {
        this.$scope = $scope;
        this.teamService = teamService;
        this.hackathonService = hackathonService;

        this.teams = [];
        this.hackathons = [];

        this.newTeamDetails = {
            name: '',
            password: '',
            hackathonId: ''
        };

        this.updatePassword = '';

        this.initialiseHackathons();
    }

    refreshAlerts() {
        this.addTeamAlert = null;
        this.editTeamAlert = null;
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

    onTeamSelected(selectedTeam) {
        this.selectedTeam = selectedTeam;
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
        this.refreshTeams();
    }

    onDelete() {
        this.refreshAlerts();
        this.teamService.deleteTeam(this.selectedTeam).then(
            () => {
                this.selectedTeam = undefined;
                this.refreshTeams();
                this.editTeamAlert = Success;
            },
            () => {
                this.editTeamAlert = Error;
            }
        );
    }

    onUpdatePassword() {
        this.makingCall = true;
        this.refreshAlerts();
        this.teamService.updatePassword(this.selectedTeam, this.updatePassword).then(
            success => {
                this.updatePassword = '';
                this.makingCall = false;
                this.editTeamAlert = Success;
            },
            () => {
                this.makingCall = false;
                this.editTeamAlert = Error;
            });
    }

    addNewTeam() {
        this.makingCall = true;
        this.refreshAlerts();
        this.teamService.addTeam(this.newTeamDetails).then(
            success => {
                this.newTeamDetails.name = '';
                this.newTeamDetails.password = '';
                this.refreshTeams();
                this.addTeamAlert = Success;
            },
            () => {
                this.makingCall = false;
                this.addTeamAlert = Error;
            }
        );
    }

    alertIsSuccess(alert) {
        return alert && alert.type === AlertTypes.SUCCESS;
    }

    alertIsError(alert) {
        return alert && alert.type === AlertTypes.ERROR;
    }

    isSelected(team) {
        return this.selectedTeam && this.selectedTeam.id === team.id;
    }

    get addButtonDisabled() {
        return (this.newTeamDetails.name.length === 0) ||
        (this.newTeamDetails.password.length === 0) || this.userInterfaceDisabled;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }

    get updatePasswordButtonDisabled() {
        return this.updatePassword.length === 0 || this.userInterfaceDisabled;
    }

    get deleteButtonDisabled() {
        return this.userInterfaceDisabled || !this.selectedTeam;
    }
}

TeamPanelController.$inject = ['$scope', 'TeamService', 'HackathonService'];

module.exports = TeamPanelController;
