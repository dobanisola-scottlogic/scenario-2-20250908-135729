class NavigationBarController {
    constructor($rootScope, $scope, loginService, milestoneBotPrefix) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.loginService = loginService;
        this.milestoneBotPrefix = milestoneBotPrefix;
    }
    get isLoggedIn() {
        return this.loginService.isLoggedIn;
    }
    get isAdmin() {
        return this.loginService.isAuthourised('ADMIN');
    }
}

NavigationBarController.$inject = ['$rootScope', '$scope', 'LoginService', 'MILESTONE_BOT_PREFIX'];

module.exports = NavigationBarController;
