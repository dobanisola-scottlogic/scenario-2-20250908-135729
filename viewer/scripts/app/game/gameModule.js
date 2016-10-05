let angular = require('angular');
let gameService = require('./GameService');
let teamModule = require('../team/teamModule');

let requires = [
    teamModule.name
];

let game = angular.module('hackathon.game', requires);

game.service('GameService', gameService);

game.directive('hackGamePanel', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/gamePanel.html'),
        controller: require('./GamePanelController'),
        controllerAs: 'controller'
    };
});

module.exports = game;
