'use strict';

angular.module('angularUiTestingApp')
  .controller('LoginRegisterCtrl' , ['$scope', 'Restangular', function ($scope, Restangular) {


  	// var baseAccounts = Restangular.all('api');

  	$scope.submitLoginInfo = function(){
  		console.log('submitloinginfo clicked')
	  	var out = Restangular.one('login').post(null,{secondField: 'second input'}).then(function(data){ //placed null so as to pass data in body not url
	  		// console.log(data[0])
	  		// console.log(data.Data)
	  		$scope.isLoggedIn = data.authorized 
	  		console.log('something was returned from login')
	  	}, function(){

	  		console.log('restangular error')
	  	})
  	}

    $scope.isLoggedIn = false;


	$scope.open = function () {
		$scope.shouldBeOpen = true;	
	};

	$scope.close = function () {
		$scope.closeMsg = 'I was closed at: ' + new Date();
		$scope.shouldBeOpen = false;
	};

	$scope.items = ['item1', 'item2'];

	$scope.opts = {
		backdropFade: true,
		dialogFade:true
	};



  }]);
