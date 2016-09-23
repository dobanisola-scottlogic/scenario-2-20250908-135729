let angular = require('angular');
let viewer = angular.module('hackathon.viewer', []);

viewer.directive('hackViewer', function() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        template: require('./content/viewer.html'),
        controller: require('./viewerController'),
        controllerAs: 'controller'
    };
});

module.exports = viewer;
