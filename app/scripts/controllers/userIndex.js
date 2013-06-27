'use strict';

angular.module('angularUiTestingApp')
  .controller('UserIndexCtrl', ['$scope', '$stateParams', 'Restangular', '$http', 
  						function ($scope, $stateParams, Restangular, $http) {


    $scope.userId = $stateParams.userId;
    console.log('userIndex page stateParams =  ' + $stateParams.userId)


    // version 1 with restangular
    Restangular.one('user', $stateParams.userId).get().then(function(data){
    	console.log('userIndex Restangular request succeded')
    	$scope.firstName = data.firstName;
    	$scope.otherData = data.otherData;
    }, function(){
    	console.log('userIndex Restangular request failed')
    })
  //version 2 with http

  $scope.$on('event:auth-loginRequired', function(event, data){
  	console.log('event:auth-loginRequired was called: ' + JSON.stringify(data))
  });//end scope loginConfirmed


  }]);
