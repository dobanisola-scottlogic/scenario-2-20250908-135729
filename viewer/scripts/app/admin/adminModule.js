let angular = require('angular');
let adminService = require('./AdminService');

let admin = angular.module('hackathon.admin', []);

admin.service('AdminService', adminService);

admin.directive('hackAdminPanel', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/adminPanel.html'),
        controller: require('./AdminPanelController'),
        controllerAs: 'controller'
    };
});

module.exports = admin;
