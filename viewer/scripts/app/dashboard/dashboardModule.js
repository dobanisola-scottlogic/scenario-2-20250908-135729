require('./content/dashboard.css');

let angular = require('angular');
let dashboard = angular.module('hackathon.dashboard', []);

dashboard.directive('hackDashboard', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            controller: '=',
            show: '=',
            role: '@',
            title: '@'
        },
        replace: true,
        template: require('./content/dashboard.html'),
        controller: require('./DashboardController'),
        controllerAs: 'controller'
    };
});

module.exports = dashboard;