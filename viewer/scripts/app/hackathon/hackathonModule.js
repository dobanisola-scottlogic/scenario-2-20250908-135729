let angular = require('angular');
let hackathonService = require('./HackathonService');

let hackathon = angular.module('hackathon.hackathon', []);

hackathon.service('HackathonService', hackathonService);

hackathon.directive('hackHackathonPanel', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/hackathonPanel.html'),
        controller: require('./HackathonPanelController'),
        controllerAs: 'controller'
    };
});

hackathon.directive('hackHackathon', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            hackathon: '='
        },
        replace: true,
        template: require('./content/hackathonListItem.html')
    };
});

module.exports = hackathon;
