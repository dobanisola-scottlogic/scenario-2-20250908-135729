let JSzip = require('jszip');
const { Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class BotPanelController {
    constructor($scope, loginService, botService) {
        this.$scope = $scope;
        this.loginService = loginService;
        this.botService = botService;
        this.setAlert = this.setAlert.bind(this);

        this.refresh();
    }

    refreshAlerts() {
        this.alert = null;
    }

    refresh() {
        this.makingCall = true;
        this.selectedBot = null;

        this.botService.getBots().then(
            allBots => {
                this.bots = allBots;

                this.botService.getActiveBots().then(
                    activeBots => {
                        this.activeBots = activeBots;
                        this.makingCall = false;
                    },
                    () => {this.makingCall = false;}
                );
            },
            () => {this.makingCall = false;}
        );
    }

    isActive(bot) {
        return this.activeBots && this.activeBots.some(activeBot => activeBot.id === bot.id);
    }

    isSelected(bot) {
        return this.selectedBot && this.selectedBot.id === bot.id;
    }

    onBotUpload(bot) {
        this.refresh();
    }

    onBotSelected(bot) {
        this.selectedBot = bot;
    }

    onDelete() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.deleteBot(this.selectedBot).then(
            () => {
                this.selectedBot = undefined;
                this.refresh();
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
                this.refresh();
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    setAlert(alert) {
        this.alert = alert;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }

    get uploadedFileName() {
        return this.file ? this.file.name : undefined;
    }

    get editButtonsDisabled() {
        return this.makingCall || !this.selectedBot;
    }

    get isTeamUser() {
        return this.loginService.isAuthourised('TEAM');
    }
}

BotPanelController.$inject = ['$scope', 'LoginService', 'BotService'];

module.exports = BotPanelController;
