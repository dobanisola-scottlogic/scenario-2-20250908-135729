let angular = require('angular');
let configuration = angular.module('hackathon.configuration', []);

configuration.constant('CONTESTANT_BOT_NAMESPACE', 'com/contestantbots');
configuration.constant('MILESTONE_BOT_NAMESPACE', 'com/scottlogic/hackathon/bots');
configuration.constant('MILESTONE_BOT_PREFIX', 'com.scottlogic.hackathon.bots.');

module.exports = configuration;
