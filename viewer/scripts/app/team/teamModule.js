let angular = require('angular');
let teamService = require('./TeamService');

let team = angular.module('hackathon.team', []);

team.service('TeamService', teamService);

team.directive('hackTeamPanel', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/teamPanel.html'),
        controller: require('./TeamPanelController'),
        controllerAs: 'controller'
    };
});

team.directive('hackTeam', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            team: '='
        },
        replace: true,
        template: require('./content/teamListItem.html')
    };
});

module.exports = team;
