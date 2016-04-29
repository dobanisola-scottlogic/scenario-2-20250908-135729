let angular = require('angular');
let authenticationModule = require('./authentication/authenticationModule');
let dashboardModule = require('./dashboard/dashboardModule');
let navigationBarModule = require('./navigationBar/navigationBarModule');
let teamModule = require('./team/teamModule');
let viewerModule = require('./viewer/viewerModule');
let collectablesChartModule = require('./charts/collectablesChartModule');

let api = angular.module('api', []);
api.constant('API_PATH', `https://${window.location.host}/application/api`);

let requires = [
    api.name,
    authenticationModule.name,
    collectablesChartModule.name,
    dashboardModule.name,
    navigationBarModule.name,
    teamModule.name,
    viewerModule.name
];

let application = angular.module('hackathon', requires);

module.exports = application;
