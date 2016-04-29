let angular = require('angular');
let authenticationService = require('./AuthenticationService');
let loginFormDirectiveFactory = require('./loginForm/loginFormDirectiveFactory');
let loginFormController = require('./loginForm/LoginFormController');

let authentication = angular.module('hackathon.authentication', []);

authentication.directive('hackLogin', loginFormDirectiveFactory);
authentication.controller('LoginFormController', loginFormController);
authentication.service('AuthenticationService', authenticationService);

module.exports = authentication;
