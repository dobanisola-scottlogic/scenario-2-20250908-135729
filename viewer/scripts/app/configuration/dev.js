let angular = require('angular');

let configuration = angular.module('hackathon.configuration', []);

configuration.constant('API_PATH', '//scottlogic-hackathon.herokuapp.com/application/api');

module.exports = configuration;
