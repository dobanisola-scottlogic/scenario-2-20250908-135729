const { Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class BotUploadController {
    constructor($scope, botService, contestantBotNamespace) {
        this.$scope = $scope;
        this.setAlert = $scope.setAlert();
        this.botService = botService;
        this.contestantBotNamespace = contestantBotNamespace;

        this.botsInCurrentFile = [];
    }

    clearUpload() {
        this.botsInCurrentFile = [];
        this.file = null;
    }

    onSelectFile(file) {
        if (file) {
            this.file = file;

            this.botService.loadZip(file)
                .then(result => {
                    this.botsInCurrentFile = Object.keys(result.files)
                        .filter(key => key.startsWith(this.contestantBotNamespace) && key.endsWith('.class'))
                        .map(className => ({
                            className: className.split('.')[0].split('/').join('.'),
                            displayName: className.split('/').pop().split('.')[0]
                        }));
                })
                .catch(() => { this.alert = Error; });
        }
    }

    upload(className) {
        if (this.$scope.isAdminUser) {
            this.uploadBotAsAdmin(className);
        }
        else {
            this.uploadBot(className);
        }
    }

    uploadBot() {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.uploadBot(this.selectedBotInCurrentFile, this.file).then(
            () => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.$scope.onUpload();
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
            () => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.$scope.onUpload();
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

    alertIsSuccess() {
        return this.alert && this.alert.type === AlertTypes.SUCCESS;
    }

    alertIsError() {
        return this.alert && this.alert.type === AlertTypes.ERROR;
    }
}

BotUploadController.$inject = ['$scope', 'BotService', 'CONTESTANT_BOT_NAMESPACE'];

module.exports = BotUploadController;
