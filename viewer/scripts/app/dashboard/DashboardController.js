class DashboardController {
    constructor($rootScope, navigationBarService) {
        this.$rootScope = $rootScope;
        this.navigationBarService = navigationBarService;
        DashboardController.instances.push(this);
    }

    get loggedIn() {
        return this.navigationBarService.isLoggedIn;
    }

    open() {
        DashboardController.instances.forEach(instance => {
            instance.close();
        });

        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}

DashboardController.$inject = ['$rootScope', 'NavigationBarService'];
DashboardController.instances = [];

module.exports = DashboardController;
