'use strict';

angular.module('angularUiTestingApp')
  .controller('UserIndexCtrl', ['$scope', '$stateParams', 'Restangular', '$http', 'userBasicInfo', 
  						function ($scope, $stateParams, Restangular, $http, userBasicInfo) {


    $scope.userId = $stateParams.userId;
    console.log('userIndex page stateParams =  ' + $stateParams.userId)


    // version 1 with restangular
    Restangular.one('user', $stateParams.userId).get().then(function(data){
    	console.log('userIndex Restangular request succeded')
    	$scope.firstName = data.firstName;//this is in another controller
    	$scope.otherData = data.otherData;//this is in another controller
      
        userBasicInfo.prepForBroadcast({
            firstName: data.firstName,
            lastName: data.lastName,
            _id: data.userId
        })


    }, function(){
    	console.log('userIndex Restangular request failed')
    })
  //version 2 with http








  }]);
