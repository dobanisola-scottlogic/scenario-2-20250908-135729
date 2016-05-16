let angular = require('angular');

let configuration = angular.module('hackathon.configuration', []);

configuration.constant('API_PATH', `//${window.location.host}/application/api`);

module.exports = configuration;
