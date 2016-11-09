class NavigationBarController {
    constructor($rootScope, $scope, loginService, sharedPropertiesService, hackathonService, milestoneBotPrefix) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.loginService = loginService;
        this.sharedPropertiesService = sharedPropertiesService;
        this.hackathonService = hackathonService;
        this.milestoneBotPrefix = milestoneBotPrefix;
        this.initialiseHackathon();
    }
    get isLoggedIn() {
        return this.loginService.isLoggedIn;
    }
    get isAdmin() {
        return this.loginService.isAuthourised('ADMIN');
    }
    toggleGameGrid() {
        this.sharedPropertiesService.toggleShowGameGrid();
    }
    initialiseHackathon() {
        this.makingCall = true;
        this.hackathonService.getHackathonFromPath().then(
            hackathon => {
                this.selectedHackathon = hackathon;
                this.makingCall = false;
            },
            () => {
                this.selectedHackathon = null;
                this.makingCall = false;
            }
        );
    }
}

NavigationBarController.$inject = ['$rootScope', '$scope', 'LoginService', 'SharedPropertiesService', 'HackathonService', 'MILESTONE_BOT_PREFIX'];

module.exports = NavigationBarController;
