'use strict';

angular.module('angularUiTestingApp')
  .controller('LoginRegisterCtrl' , ['$scope', 'Restangular', '$state', '$stateParams', '$http',
  		function ($scope, Restangular, $state, $stateParams, $http) {

  	$scope.isLoggedIn = false

  	$scope.submitLoginInfo = function(loginInfo){
  		console.log('submitloinginfo clicked')
  		console.log(JSON.stringify(loginInfo, null, '\t'))

	  	Restangular.one('login').post(null,{secondField: 'second input'}).then(function(data){ //placed null so as to pass data in body not url
	  		$scope.isLoggedIn = data.authorized 
	  	  	$stateParams.userId = data.userId;
	  	  	$scope.submitLoginClicked = true;//turn login button off.
	  		// console.log($stateParams)		
	  		// $state.transitionTo('userIndex', $stateParams);
	  	}, function(){
	  		console.log('restangular error');
	  		$scope.submitLoginClicked = false;//turn loginButtnOn
	  	})
  	}//end of submitLogInInfo


	$scope.$on('event:auth-loginRequired', function(event, data){
	  	console.log('event:auth-loginRequired was called: ' + JSON.stringify(data))
	  	$scope.shouldLoginModalBeOpen = true;
	  	$scope.showUnAuthMessage = true;
	  	$scope.unAuthMessage = "You are unauthorized to view this page. Please enter correct login credentials or logout."
	});//end scope loginConfirmed



	$scope.openLoginModal = function () {
		$scope.shouldLoginModalBeOpen = true;	
		// $scope.submitLoginClicked = false;//was here, i think its unneccessary; should be removed
	};
	$scope.closeLoginModal = function () {
		$scope.shouldLoginModalBeOpen = false;
	};
	$scope.optsModal = {
		backdropFade: true,
		dialogFade:true
	};



  }]);
