let angular = require('angular');

let collectablesChart = angular.module('hackathon.collectablesChart', []);

collectablesChart.directive('collectablesChart', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<div id="collectables-chart" class="chart"></div>'
    };
});

module.exports = collectablesChart;
