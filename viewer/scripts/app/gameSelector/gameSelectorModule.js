let angular = require('angular');
let gameSelectorController = require('./GameSelectorController');

let gameSelector = angular.module('hackathon.gameSelector', []);

gameSelector.controller('GameSelectorController', gameSelectorController);

gameSelector.directive('hackGameSelector', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/gameSelector.html'),
        controller: 'GameSelectorController',
        controllerAs: 'controller'
    };
});

module.exports = gameSelector;
