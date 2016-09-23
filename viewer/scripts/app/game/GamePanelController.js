const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class GamePanelController {
    constructor(teamService, gameService) {
        this.teamService = teamService;
        this.gameService = gameService;

        // These map names are a direct analogue of the file names found in the 'game-engine/src/resources/maps' directory.
        // Hard-coded for now as there is currently no map service.
        function MapOption(display, value, isDefault) {
            return {display, value, isDefault};
        }
        this.maps = [new MapOption('Very Easy', 'VeryEasy'),
            new MapOption('Easy', 'Easy', true),
            new MapOption('Medium', 'Medium'),
            new MapOption('Large Medium', 'LargeMedium'),
            new MapOption('Hard', 'Hard')];

        this.teams = [];

        this.game = {
            map: this.maps.find(map => { return map.isDefault; }).value,
            teams: []
        };

        this.refreshTeams();
    }

    refreshAlerts() {
        this.alert = null;
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

    onTeamSelected(team) {
        var index = this.game.teams.indexOf(team.name);
        if (index === -1) {
            this.game.teams.push(team.name);
        } else {
            this.game.teams.splice(index, 1);
        }
    }

    playGame() {
        this.makingCall = true;

        this.gameService.playGame(this.game).then(
            success => {
                this.game.map = this.maps.find(map => { return map.isDefault; }).value;
                this.game.teams = [];
                this.makingCall = false;
                this.alert = Success;
            },
            error => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    isSelected(team) {
        return this.game.teams.indexOf(team.name) !== -1;
    }

    alertIsSuccess() {
        return this.alert && this.alert.type === AlertTypes.SUCCESS;
    }

    alertIsError() {
        return this.alert && this.alert.type === AlertTypes.ERROR;
    }

    get addButtonDisabled() {
        return (this.game.map.length === 0) || (this.game.teams.length <= 1) || this.userInterfaceDisabled;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }
}

GamePanelController.$inject = ['TeamService', 'GameService'];

module.exports = GamePanelController;
