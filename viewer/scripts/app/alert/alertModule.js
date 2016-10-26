let angular = require('angular');
const AlertTypes = require('./AlertTypes');

let alert = angular.module('hackathon.alert', []);

alert.directive('hackAlert', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            alert: '=',
            closeAlert: '&'
        },
        replace: true,
        controller: ['$scope', function AlertController($scope) {
            $scope.isSuccess = function() {
                return $scope.alert && $scope.alert.type === AlertTypes.SUCCESS;
            };
            $scope.isError = function() {
                return $scope.alert && $scope.alert.type === AlertTypes.ERROR;
            };
        }],
        template: require('./content/alert.html')
    };
});


module.exports = alert;
