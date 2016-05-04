let angular = require('angular');
let navigationBarController = require('./NavigationBarController');
let navigationBarService = require('./NavigationBarService');

let navigationBar = angular.module('hackathon.navigationBar', []);

navigationBar.controller('NavigationBarController', navigationBarController);
navigationBar.service('NavigationBarService', navigationBarService);

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