'use strict';

angular.module('angularUiTestingApp')
  .controller('LoginRegisterCtrl' , ['$scope', 'Restangular', '$state', '$stateParams', '$http',
  	 function ($scope, Restangular, $state, $stateParams, $http) {


  	// var baseAccounts = Restangular.all('api');

  	$scope.submitLoginInfo = function(){
  		console.log('submitloinginfo clicked')
	  	// Restangular.one('login').post(null,{secondField: 'second input'}).then(function(data){ //placed null so as to pass data in body not url
	  	// 	// console.log(data[0])
	  	// 	// console.log(data.Data)
	  	// 	$scope.isLoggedIn = data.authorized 
	  	// 	console.log('will redirect to ---> ' + data.redirectTO)
	  	// 	console.log('something was returned from login')
	  		
	  	// 	// $location.path(data.redirectTo);
	  	//   	// authService.loginConfirmed();
	  	//   	$stateParams.userId = data.userId;
	  	// 	console.log($stateParams)		
	  	// 	$state.transitionTo('userIndex', $stateParams);

	  	// 	// $state.transitionTo('userIndex'. $stateParams);
	  	// }, function(){
	  	// 	console.log('restangular error')
	  	// })

        $http.post('api/login', {loginInfo: 'some data'})
            .success(function (data, status, headers, config) {

            // authService.loginConfirmed();
            console.log('controller: loginRegister: login will now redirect to ---> ' + data.redirectTo)
            $stateParams.userId = data.userId;
            $state.transitionTo('userIndex', $stateParams);
        })
            .error(function (data, status, headers, config) {
            console.log('controller: loginRegister: login failed hence turn button back on')
            // $scope.submitLoginClicked = false;
        });






  	}//end of submitLogInInfo

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
