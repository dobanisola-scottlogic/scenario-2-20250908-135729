const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class TeamPanelController {
    constructor($scope, teamService) {
        this.$scope = $scope;
        this.teamService = teamService;

        this.teams = [];

        this.newTeamDetails = {
            username: '',
            password: ''
        };

        this.updatePassword = '';

        this.refreshTeams();
    }

    refreshAlerts() {
        this.addTeamAlert = null;
        this.editTeamAlert = null;
    }

    refreshTeams() {
        this.makingCall = true;

        this.teamService.getTeams().then(
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
        this.teamService.addTeam(this.newTeamDetails.username, this.newTeamDetails.password).then(
            success => {
                this.newTeamDetails.username = '';
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
        return (this.newTeamDetails.username.length === 0) ||
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

TeamPanelController.$inject = ['$scope', 'TeamService'];

module.exports = TeamPanelController;
