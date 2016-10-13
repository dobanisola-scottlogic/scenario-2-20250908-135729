let angular = require('angular');
let loginController = require('./LoginController');
let loginService = require('./LoginService');

let login = angular.module('hackathon.login', []);

login.controller('LoginController', loginController);
login.service('LoginService', loginService);

login.directive('hackLogin', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/login.html'),
        controller: 'LoginController',
        controllerAs: 'controller'
    };
});

module.exports = login;
