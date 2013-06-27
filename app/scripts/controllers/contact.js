'use strict';

angular.module('angularUiTestingApp')
  .controller('ContactCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    console.log('contact controller called')
  }]);
