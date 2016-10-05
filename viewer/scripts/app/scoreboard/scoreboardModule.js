let angular = require('angular');
let scoreboardController = require('./ScoreboardController');

let scoreboard = angular.module('hackathon.scoreboard', []);

scoreboard.controller('ScoreboardController', scoreboardController);

scoreboard.directive('hackScoreboard', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        replace: true,
        template: require('./content/scoreboard.html'),
        controller: 'ScoreboardController',
        controllerAs: 'controller'
    };
});

module.exports = scoreboard;
