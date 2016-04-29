let angular = require('angular');
let navigationBarModule = require('./navigationBar/navigationBarModule');
let viewerModule = require('./viewer/viewerModule');
let collectablesChartModule = require('./charts/collectablesChartModule');

let requires = [
    navigationBarModule.name,
    viewerModule.name,
    collectablesChartModule.name
];

let application = angular.module('hackathon', requires);

module.exports = application;
