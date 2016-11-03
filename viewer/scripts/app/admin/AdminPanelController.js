const { Success, Error } = require('../alert/Alert');
const AlertTypes = require('../alert/AlertTypes');

class AdminPanelController {
    constructor($scope, adminService, loginService, $window) {
        this.$scope = $scope;
        this.$window = $window;
        this.adminService = adminService;
        this.loginService = loginService;
        this.updatePassword = '';
    }

    refreshAlerts() {
        this.alert = null;
    }

    onUpdatePassword() {
        this.makingCall = true;
        this.refreshAlerts();
        this.adminService.updatePassword(this.updatePassword).then(
            success => {
                this.loginService.setAuthenticationData('admin', this.updatePassword);
                this.updatePassword = '';
                this.makingCall = false;
                this.alert = Success;
            },
            () => {
                this.makingCall = false;
                this.alert = Error;
            });
    }

    get userInterfaceDisabled() {
        return this.makingCall;
    }

    get updatePasswordButtonDisabled() {
        return this.updatePassword.length === 0 ||
        this.userInterfaceDisabled;
    }
}

AdminPanelController.$inject = ['$scope', 'AdminService', 'LoginService', '$window', '$http'];

module.exports = AdminPanelController;
