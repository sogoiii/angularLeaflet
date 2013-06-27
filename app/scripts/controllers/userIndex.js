'use strict';

angular.module('angularUiTestingApp')
  .controller('UserIndexCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
