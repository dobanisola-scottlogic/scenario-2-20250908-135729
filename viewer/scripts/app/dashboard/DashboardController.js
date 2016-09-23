class DashboardController {
    constructor($scope) {
        this.$scope = $scope;
        DashboardController.instances.push(this);
    }

    getId() {
        return this.$scope.$id;
    }
}

DashboardController.$inject = ['$scope'];
DashboardController.instances = [];

module.exports = DashboardController;
