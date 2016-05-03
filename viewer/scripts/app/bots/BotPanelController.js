class BotPanelController {
    constructor($scope, authenticationService, botService, Upload) {
        this.$scope = $scope;
        this.authenticationService = authenticationService;
        this.botService = botService;
        this.Upload = Upload;

        this.uploadBotClassName = '';

        this.refresh();
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

    onUpload() {
        this.makingCall = true;

        this.botService.uploadBot(this.uploadBotClassName, this.file).then(
            () => {
                this.file = null;
                this.uploadBotClassName = '';
                this.refresh();
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    onDelete() {
        this.makingCall = true;
        this.botService.deleteBot(this.selectedBot).then(
            () => {
                this.selectedBot = undefined;
                this.refresh();
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    onMakeActive() {
        this.makingCall = true;
        this.botService.makeActive(this.selectedBot).then(
            () => {
                this.refresh();
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    get uploadButtonDisabled() {
        return !this.isTeamUser || this.makingCall || !this.file || this.uploadBotClassName.length === 0;
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
        return this.authenticationService.isAuthourised('TEAM');
    }
}

BotPanelController.$inject = ['$scope', 'AuthenticationService', 'BotService', 'Upload'];

module.exports = BotPanelController;
