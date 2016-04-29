require('./content/bot.css');

let angular = require('angular');
let botService = require('./BotService');

let bot = angular.module('hackathon.bot', []);

bot.service('BotService', botService);

bot.directive('hackBot', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            bot: '=',
            isActive: '='
        },
        replace: true,
        template: require('./content/botListItem.html')
    };
});

bot.directive('hackBotPanel', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/botPanel.html'),
        controller: require('./BotPanelController'),
        controllerAs: 'controller'
    };
});

module.exports = bot;
