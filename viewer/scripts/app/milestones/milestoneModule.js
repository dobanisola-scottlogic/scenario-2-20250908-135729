let angular = require('angular');
let milestoneService = require('./MilestoneService');

let milestone = angular.module('hackathon.milestone', []);

milestone.service('MilestoneService', milestoneService);

module.exports = milestone;
