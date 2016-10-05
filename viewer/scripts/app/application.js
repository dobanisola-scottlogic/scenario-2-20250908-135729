let angular = require('angular');

let ngfileupload = require('ng-file-upload');
let configurationModule = require('configuration');
let botModule = require('./bots/botModule');
let dashboardModule = require('./dashboard/dashboardModule');
let navigationBarModule = require('./navigationBar/navigationBarModule');
let containerModule = require('./container/containerModule');
let hackathonModule = require('./hackathon/hackathonModule');
let teamModule = require('./team/teamModule');
let gameModule = require('./game/gameModule');
let viewerModule = require('./viewer/viewerModule');
let collectablesChartModule = require('./charts/collectablesChartModule');
let phaseChartModule = require('./charts/phaseChartModule');
let scoreboardModule = require('./scoreboard/scoreboardModule');

let requires = [
    'ngFileUpload',
    configurationModule.name,
    botModule.name,
    collectablesChartModule.name,
    phaseChartModule.name,
    dashboardModule.name,
    navigationBarModule.name,
    hackathonModule.name,
    teamModule.name,
    gameModule.name,
    viewerModule.name,
    scoreboardModule.name,
    containerModule.name
];

let application = angular.module('hackathon', requires);

application.service('SharedPropertiesService', require('./sharedProperties/SharedPropertiesService'));

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

application.directive('alert', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            alert: '=',
            isSuccess: '&',
            isError: '&',
            closeAlert: '&'
        },
        replace: true,
        template: require('./alert/content/alert.html')
    };
});

module.exports = application;
