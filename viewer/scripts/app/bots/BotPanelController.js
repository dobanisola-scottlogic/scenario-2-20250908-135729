const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class BotPanelController {
    constructor($scope, navigationBarService, botService, Upload, contestantBotNamespace) {
        this.$scope = $scope;
        this.navigationBarService = navigationBarService;
        this.botService = botService;
        this.Upload = Upload;
        this.contestantBotNamespace = contestantBotNamespace;

        this.botsInCurrentFile = [];

        this.refresh();
    }

    refreshAlerts() {
        this.alert = null;
    }

    refresh() {
        this.makingCall = true;

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
                this.alert = Success;
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
                this.alert = Success;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    alertIsSuccess() {
        return this.alert && this.alert.type === AlertTypes.SUCCESS;
    }

    alertIsError() {
        return this.alert && this.alert.type === AlertTypes.ERROR;
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
        return this.navigationBarService.isAuthourised('TEAM');
    }
}

BotPanelController.$inject = ['$scope', 'NavigationBarService', 'BotService', 'Upload', 'CONTESTANT_BOT_NAMESPACE'];

module.exports = BotPanelController;
