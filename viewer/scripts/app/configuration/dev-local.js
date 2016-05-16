let angular = require('angular');

let configuration = angular.module('hackathon.configuration', []);

configuration.constant('API_PATH', '//localhost:8080/application/api');

module.exports = configuration;
