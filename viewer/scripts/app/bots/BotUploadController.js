const { Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class BotUploadController {
    constructor($scope, botService, contestantBotNamespace) {
        this.$scope = $scope;
        this.refreshAlerts = this.refreshAlerts.bind(this);
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
        this.refreshAlerts();

        if (file) {
            if (file.name.endsWith('.jar')) {
                this.makingCall = true;

                this.botService.getValidBotsFromJar(file)
                    .then(result => {
                        let errorKeys = Object.keys(result.messageLookup);
                        if (errorKeys.length > 0) {
                            // show custom error messages, if present
                            this.setAlert({
                                type: AlertTypes.ERROR,
                                message: 'Problems with:',
                                details: errorKeys.map(errorKey => ({
                                    text: errorKey,
                                    title: result.messageLookup[errorKey]
                                }))
                            });
                        } else if (result.contestantBots.length < 1) {
                            // show a generic error in case BotResource checks fail to add a suitable custom error
                            this.setAlert({
                                type: AlertTypes.ERROR,
                                message: 'There were problems uploading your Jar file, please check with an organiser for more details'
                            });
                        } else {
                            this.file = file;
                            this.uploadedJarId = result.id;
                            this.botsInCurrentFile = result.contestantBots
                                .map(className => ({
                                    className: className.split('.')[0].split('/').join('.'),
                                    displayName: className.split('/').pop().split('.')[0]
                                }));
                        }
                        this.makingCall = false;
                    })
                    .catch(() => {
                        this.setAlert(Error);
                        this.makingCall = false;
                    });
            } else {
                // show generic error
                this.setAlert({
                    type: AlertTypes.ERROR,
                    message: 'Select a Jar file which should contain at least one class that extends com.scottlogic.hackathon.game.Bot'
                });
            }
        }
    }

    addBot() {
        if (this.selectedBotInCurrentFile) {
            if (this.$scope.isAdminUser) {
                this.addBotAsAdmin();
            }
            else {
                this.addBotAsTeam();
            }
        }
    }

    addBotAsTeam() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.addBot(this.selectedBotInCurrentFile, this.uploadedJarId).then(
            bot => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.makingCall = false;

                if (bot === '') {
                    this.setAlert({
                        type: AlertTypes.ERROR,
                        message: 'Jar file not found, it may have timed out.'
                    });
                } else {
                    this.$scope.onUpload({bot});
                }
            },
            () => {
                this.makingCall = false;
                this.setAlert(Error);
            }
        );
    }

    addBotAsAdmin() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.addBotAsAdmin(this.selectedBotInCurrentFile, this.$scope.teamName, this.uploadedJarId).then(
            bot => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.makingCall = false;

                if (bot === '') {
                    this.setAlert({
                        type: AlertTypes.ERROR,
                        message: 'Jar file not found, it may have timed out.'
                    });
                } else {
                    this.$scope.onUpload({bot});
                }
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
