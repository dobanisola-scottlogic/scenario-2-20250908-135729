let angular = require('angular');

let collectablesChart = angular.module('hackathon.collectablesChart', []);

collectablesChart.directive('collectablesChart', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<div id="collectables-chart" class="col-md-offset= 10 col-md-2"></div>'
    };
});

module.exports = collectablesChart;
