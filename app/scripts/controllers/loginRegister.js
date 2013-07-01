'use strict';

angular.module('angularUiTestingApp')
  .controller('LoginRegisterCtrl' , ['$scope', 'Restangular', '$state', '$stateParams', '$http', 'userBasicInfo', 
  		function ($scope, Restangular, $state, $stateParams, $http, userBasicInfo) {

  	$scope.isLoggedIn = false

  	$scope.submitLoginInfo = function(loginInfo){
  		console.log('submitloinginfo clicked')
  		console.log(JSON.stringify(loginInfo, null, '\t'))

	  	Restangular.one('login').post(null,loginInfo).then(function(data){ //placed null so as to pass data in body not url
	  		$scope.isLoggedIn = data.authorized 
	  	  	$stateParams.userId = data.userId;
	  	  	$scope.submitLoginClicked = true;//turn login button off.
	  		// console.log($stateParams)		
	  		$state.transitionTo('userIndex', $stateParams);
	  		$scope.shouldLoginModalBeOpen = false;//close modal
	  	}, function(){
	  		console.log('restangular error');
	  		$scope.submitLoginClicked = false;//turn loginButtnOn
	  	})
  	}//end of submitLogInInfo

  	$scope.submitRegisterInfo = function(RegisterInfo){
  		console.log('submitRegisterInfo was called')


  		Restangular.one('register').post(null, RegisterInfo).then(function(data){
  			console.log('register success')
  			console.log(data)

  			$scope.isLoggedIn = data.authorized;
  			$stateParams.userId = data.userId;
  			$state.transitionTo('userIndex', $stateParams);
  			$scope.shouldRegisterModalBeOpen = false;//close modal


  		}, function(){
  			console.log('register failed');
  			$scope.submitLoginClicked = false;//turn loginButtnOn
  			$scope.showRegisterServerError = true;
  			$scope.RegisterServerError = 'Whoa! We are having a problem. Please try again or return later.'
  		});
  	};//end of submitRegisterInfo



    $scope.$on('userBasicInfoBroadcast', function () {
        $scope.userName = userBasicInfo.userName;
        $scope.userId = userBasicInfo._id;
        $scope.isLoggedIn = true;
    });

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
	$scope.openRegisterModal = function () {
		$scope.shouldRegisterModalBeOpen = true;	
		// $scope.submitLoginClicked = false;//was here, i think its unneccessary; should be removed
	};
	$scope.closeRegisterModal = function () {
		$scope.shouldRegisterModalBeOpen = false;
	};
	$scope.optsModal = {
		backdropFade: true,
		dialogFade:true
	};



  }]);
