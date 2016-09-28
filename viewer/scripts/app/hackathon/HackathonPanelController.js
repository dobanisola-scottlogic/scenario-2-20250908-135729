const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class HackathonPanelController {
    constructor(hackathonService) {
        this.hackathonService = hackathonService;

        this.hackathon = {
            name: ''
        };

        this.hackathons = [];

        this.refreshHackathons();
    }

    createHackathon() {
        this.makingCall = true;
        this.hackathonService.createHackathon(this.hackathon).then(
            success => {
                this.hackathon.name = '';
                this.refreshHackathons();
                this.makingCall = false;
                this.alert = Success;
            },
            error => {
                this.makingCall = false;
                this.alert = Error;
            },
            () => {
                this.makingCall = false;
            }
        );
    }

    refreshHackathons() {
        this.makingCall = true;

        this.hackathonService.getHackathons().then(
            newHackathons => {
                this.hackathons = newHackathons;
                this.makingCall = false;
            },
            () => {
                this.hackathons = [];
                this.makingCall = false;
            }
        );
    }

    onHackathonSelected(selectedHackathon) {
        this.selectedHackathon = selectedHackathon;
    }

    isSelected(hackathon) {
        return this.selectedHackathon && this.selectedHackathon.id === hackathon.id;
    }

    onDelete() {
        if (window.confirm('Are you sure? This will also delete all teams and games associated with the hackathon: ' + this.selectedHackathon.name)) {
            this.makingCall = true;
            this.hackathonService.deleteHackathon(this.selectedHackathon).then(
                () => {
                    this.selectedHackathon = undefined;
                    this.refreshHackathons();
                    this.makingCall = false;
                }
            );
        }
    }

    get addButtonDisabled() {
        return (this.hackathon.name.length === 0) || this.userInterfaceDisabled;
    }

    get userInterfaceDisabled() {
        return this.makingCall;
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

HackathonPanelController.$inject = ['HackathonService'];

module.exports = HackathonPanelController;
