let angular = require('angular');

let ngfileupload = require('ng-file-upload');
let botModule = require('./bots/botModule');

let dashboardModule = require('./dashboard/dashboardModule');
let navigationBarModule = require('./navigationBar/navigationBarModule');
let teamModule = require('./team/teamModule');
let gameModule = require('./game/gameModule');
let viewerModule = require('./viewer/viewerModule');
let collectablesChartModule = require('./charts/collectablesChartModule');

let api = angular.module('api', []);
api.constant('API_PATH', `//${window.location.host}/application/api`);

let requires = [
    'ngFileUpload',
    api.name,
    botModule.name,
    collectablesChartModule.name,
    dashboardModule.name,
    navigationBarModule.name,
    teamModule.name,
    gameModule.name,
    viewerModule.name
];

let application = angular.module('hackathon', requires);

application.directive('hackTransclude', function() {
    return {
        restrict: 'AE',
        replace: false,
        link: function($scope, $element, attrs, controller, transclude) {
            var childScope = $scope.$new();
            transclude(childScope, function(clonedElement, scope) {
                $element.append(clonedElement);
            });
        }
    };
});

module.exports = application;
