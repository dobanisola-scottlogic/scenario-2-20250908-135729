let LOGIN_STATE = require('../../enums/loginState.js');

class LoginController {
    constructor($scope, loginService) {
        this.$scope = $scope;
        this.loginService = loginService;

        this.credentials = {
            username: '',
            password: ''
        };
    }

    login() {
        this.state = LOGIN_STATE.INPROGRESS;

        this.loginService.login(this.credentials.username, this.credentials.password).then(
            () => {
                this.state = LOGIN_STATE.AUTHOURIZED;
            },
            () => {
                this.state = LOGIN_STATE.FAILED;
            }
        );
    }
    logout() {
        this.loginService.logout();
        this.state = this.state = LOGIN_STATE.NONE;
    }
    updateState() {
        this.state = LOGIN_STATE.NONE;
    }
    get isLoggedIn() {
        return this.state === LOGIN_STATE.AUTHOURIZED;
    }
    get isLoggingIn() {
        return this.state === LOGIN_STATE.INPROGRESS;
    }
    get isFailed() {
        return this.state === LOGIN_STATE.FAILED;
    }
    get loggedInUserName() {
        return this.loginService.getLoggedInUserName();
    }
    get isAdmin() {
        return this.loginService.isAuthourised('ADMIN');
    }
}

LoginController.$inject = ['$scope', 'LoginService'];

module.exports = LoginController;
