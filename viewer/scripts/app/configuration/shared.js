let angular = require('angular');
let configuration = angular.module('hackathon.configuration', []);

configuration.constant('CONTESTANT_BOT_NAMESPACE', 'com/contestantbots');

module.exports = configuration;
