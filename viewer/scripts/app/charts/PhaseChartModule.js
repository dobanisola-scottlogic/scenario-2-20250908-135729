let angular = require('angular');

let phaseChart = angular.module('hackathon.phaseChart', []);

phaseChart.directive('phaseChart', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<div id="phase-chart"></div>'
    };
});

module.exports = phaseChart;
