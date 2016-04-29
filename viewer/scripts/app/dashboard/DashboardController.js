class DashboardController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
        this.isOpen = false;
    }

    get loggedIn() {
        return this.authenticationService.isLoggedIn;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}

DashboardController.$inject = ['AuthenticationService'];

module.exports = DashboardController;
