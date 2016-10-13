class DashboardController {
    constructor($scope, loginService) {
        this.$scope = $scope;
        this.loginService = loginService;
        DashboardController.instances.push(this);
    }

    getId() {
        return this.$scope.$id;
    }

    get isLoggedIn() {
        return this.loginService.isLoggedIn;
    }

    get isAuthourised() {
        return this.isLoggedIn && (!this.$scope.role || this.loginService.isAuthourised(this.$scope.role));
    }

    open() {
        DashboardController.instances.forEach(instance => {
            instance.close();
        });

        this.isOpen = true;
        this.hasBeenOpened = true;
    }

    close() {
        this.isOpen = false;
    }
}

DashboardController.$inject = ['$scope', 'LoginService'];
DashboardController.instances = [];

module.exports = DashboardController;
