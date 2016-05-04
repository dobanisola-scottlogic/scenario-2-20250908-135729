class GamePanelController {
    constructor(teamService, gameService) {
        this.teamService = teamService;
        this.gameService = gameService;

        this.teams = [];

        this.game = {
            map: '',
            teams: []
        };

        this.refreshTeams();
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
                this.game.map = '';
                this.game.teams = [];
                this.makingCall = false;
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    isSelected(team) {
        return this.game.teams.indexOf(team.name) !== -1;
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
