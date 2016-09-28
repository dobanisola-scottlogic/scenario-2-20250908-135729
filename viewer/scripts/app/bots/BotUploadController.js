const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');
let JSzip = require('jszip');

class BotUploadController {
    constructor($scope, botService, Upload, contestantBotNamespace) {
        this.$scope = $scope;
        this.botService = botService;
        this.Upload = Upload;
        this.contestantBotNamespace = contestantBotNamespace;

        this.botsInCurrentFile = [];
    }

    onSelectFile(file) {
        this.file = file;
        const fr = new FileReader();

        fr.onload = () => {
            const zip = new JSzip();

            zip.loadAsync(fr.result)
                .then(result => {
                    this.botsInCurrentFile = Object.keys(result.files)
                        .filter(key => key.startsWith(this.contestantBotNamespace) && key.endsWith('.class'))
                        .map(className => ({
                            className: className.split('.')[0].split('/').join('.'),
                            displayName: className.split('/').pop().split('.')[0]
                        }));
                })
                .catch(err => {
                    console.log(err);
                });
        };

        fr.readAsArrayBuffer(file);
    }

    upload(className) {
        if (this.$scope.isAdminUser) {
            this.uploadBotAsAdmin(className);
        }
        else {
            this.uploadBot(className);
        }
    }

    uploadBot(className) {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.uploadBot(className, this.file).then(
            () => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.$scope.onUpload();
                this.makingCall = false;
                this.alert = Success;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
    }

    uploadBotAsAdmin(className) {
        this.makingCall = true;
        this.refreshAlerts();
        this.botService.uploadBotAsAdmin(className, this.$scope.teamName, this.file).then(
            () => {
                this.file = null;
                this.botsInCurrentFile = [];
                this.$scope.onUpload();
                this.makingCall = false;
                this.alert = Success;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            }
        );
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

BotUploadController.$inject = ['$scope', 'BotService', 'Upload', 'CONTESTANT_BOT_NAMESPACE'];

module.exports = BotUploadController;
