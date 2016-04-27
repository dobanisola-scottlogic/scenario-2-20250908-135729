let angular = require('angular');

let navigationBar = angular.module('hackathon.navigationBar', []);

navigationBar.directive('hackNavigationBar', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<nav></nav>'
    };
});


module.exports = navigationBar;
