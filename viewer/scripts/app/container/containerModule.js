let angular = require('angular');

let container = angular.module('hackathon.container', []);

container.directive('hackContainer', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/container.html')
    };
});

module.exports = container;
