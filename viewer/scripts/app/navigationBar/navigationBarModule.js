let angular = require('angular');
let navigationBarController = require('./NavigationBarController');

let navigationBar = angular.module('hackathon.navigationBar', []);

navigationBar.controller('NavigationBarController', navigationBarController);

navigationBar.directive('hackNavigationBar', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        replace: true,
        template: require('./content/navigationBar.html'),
        controller: 'NavigationBarController',
        controllerAs: 'controller'
    };
});

module.exports = navigationBar;
