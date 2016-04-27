let angular = require('angular');

let viewer = angular.module('hackathon.viewer', []);

viewer.directive('hackViewer', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: '<div id="phaserApp"></div>'
    };
});


module.exports = viewer;
