let angular = require('angular');

let phaseChart = angular.module('hackathon.phaseChart', []);

let phaseChartController = require('./PhaseChartController');

phaseChart.controller('PhaseChartController', phaseChartController);

phaseChart.directive('phaseChart', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<div id="phase-chart"></div>',
        controller: 'PhaseChartController',
        controllerAs: 'controller'
    };
});

module.exports = phaseChart;
