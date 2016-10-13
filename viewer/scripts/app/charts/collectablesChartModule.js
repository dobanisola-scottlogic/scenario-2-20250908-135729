let angular = require('angular');

let collectablesChart = angular.module('hackathon.collectablesChart', []);

let collectablesChartController = require('./CollectablesChartController');

collectablesChart.controller('CollectablesChartController', collectablesChartController);

collectablesChart.directive('collectablesChart', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<div id="collectables-chart" class="col-md-offset= 10 col-md-2"></div>',
        controller: 'CollectablesChartController',
        controllerAs: 'controller'
    };
});

module.exports = collectablesChart;
