class DashboardController {
    constructor($scope, navigationBarService) {
        this.$scope = $scope;
        this.navigationBarService = navigationBarService;
        DashboardController.instances.push(this);
    }

    get isLoggedIn() {
        return this.navigationBarService.isLoggedIn;
    }

    get isAuthourised() {
        return this.isLoggedIn && (!this.$scope.role || this.navigationBarService.isAuthourised(this.$scope.role));
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

DashboardController.$inject = ['$scope', 'NavigationBarService'];
DashboardController.instances = [];

module.exports = DashboardController;
