const { Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class BotUploadController {
    constructor($scope, botService, contestantBotNamespace) {
        this.$scope = $scope;
        this.setAlert = this.setAlert.bind(this);
        this.botService = botService;
        this.contestantBotNamespace = contestantBotNamespace;

        this.botsInCurrentFile = [];
    }

    setAlert(alert) {
        this.alert = alert;
    }

    clearUpload() {
        this.botsInCurrentFile = [];
        this.file = null;
    }

    onSelectFile(file) {
        let alert = null;
        if (file && file.name.endsWith('.jar')) {
            this.file = file;

            this.botService.loadZip(file)
                .then(result => {
                    if (result.files.length < 1) {
                        alert = {
                            type: AlertTypes.ERROR,
                            message: 'Select a Jar file with at least one class that extends com.scottlogic.hackathon.game.Bot'
                        };
                    }
                    else {
                        alert = null;
                        this.botsInCurrentFile = Object.keys(result.files)
                            .filter(key => key.startsWith(this.contestantBotNamespace) && key.endsWith('.class'))
                            .map(className => ({
                                className: className.split('.')[0].split('/').join('.'),
                                displayName: className.split('/').pop().split('.')[0]
                            }));
                    }
                })
                .catch(() => { this.alert = Error; });
        }
        else {
            alert = {
                type: AlertTypes.ERROR,
                message: 'Select a Jar file with at least one class that extends com.scottlogic.hackathon.game.Bot'
            };
        }
        this.setAlert(alert);
    }

    upload() {
        if (this.selectedBotInCurrentFile) {
            if (this.$scope.isAdminUser) {
                this.uploadBotAsAdmin();
            }
            else {
                this.uploadBot();
            }
        }
    }

    uploadBot() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.uploadBot(this.selectedBotInCurrentFile, this.file).then(
            bot => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.$scope.onUpload({bot});
                this.makingCall = false;
            },
            () => {
                this.makingCall = false;
                this.setAlert(Error);
            }
        );
    }

    uploadBotAsAdmin() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.uploadBotAsAdmin(this.selectedBotInCurrentFile, this.$scope.teamName, this.file).then(
            bot => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.$scope.onUpload({bot});
                this.makingCall = false;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    get selectBotDisabled() {
        return this.botsInCurrentFile.length === 0;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }

    get uploadedFileName() {
        return this.file ? this.file.name : undefined;
    }

    refreshAlerts() {
        this.alert = null;
    }
}

BotUploadController.$inject = ['$scope', 'BotService', 'CONTESTANT_BOT_NAMESPACE'];

module.exports = BotUploadController;
