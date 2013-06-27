'use strict';

var app = angular.module('angularUiTestingApp', ['ui.state', 'ui.bootstrap', 'restangular', 'http-auth-interceptor'])
  .config([  '$stateProvider', '$routeProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider',
    function (  $stateProvider, $routeProvider,   $urlRouterProvider , $locationProvider, RestangularProvider) {
    
    RestangularProvider.setBaseUrl("/api");
    // RestangularProvider.setDefaultHttpFields({cache: true});
    RestangularProvider.setFullResponse = true;
    // RestangularProvider.setResponseExtractor(function(response) {
    //   console.log(response)
    //   var newResponse = response;
    //   newResponse.originalElement = response.data;
    //   return newResponse
    // })


     // $locationProvider.hashPrefix('#');

    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl'
    //   })
    //   .otherwise({
    //     redirectTo: '/'
    //   });

  $stateProvider
    .state('index', {
        url: "", // root route
        views: {
            "bodyView": {
                templateUrl: "views/main.html",
                controller: 'MainCtrl'
            }
        }
    })
    .state('contact', {
      url: '/contact',
      views: {
        "bodyView": {
          templateUrl: "views/contact.html",
          controller: "ContactCtrl"
        }
      }
    })
    .state('about', {
      url: '/about',
      views: {
          "bodyView": {
            templateUrl: "views/about.html",
            controller: "AboutCtrl"
          }
      }
    })
    .state('userIndex', {
      url: '/user/{userId}',
      views: {
        "bodyView" : {
          templateUrl: "views/userIndex.html",
          controller: "UserIndexCtrl"
        }
      }
    })

  }]);
