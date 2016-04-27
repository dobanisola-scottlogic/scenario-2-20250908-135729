let angular = require('angular');
let navigationBarModule = require('./navigationBar/navigationBarModule');
let viewerModule = require('./viewer/viewerModule');

let requires = [
    navigationBarModule.name,
    viewerModule.name
];

let application = angular.module('hackathon', requires);

module.exports = application;
