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

bot.directive('hackBotUpload', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            onUpload: '&',
            setAlert: '&',
            isAdminUser: '=',
            selectFileDisabled: '&',
            teamName: '@'
        },
        replace: true,
        template: require('./content/botUploadForm.html'),
        controller: require('./BotUploadController'),
        controllerAs: 'controller'
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
