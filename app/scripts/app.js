'use strict';

var app = angular.module('angularUiTestingApp', ['ui.state', 'ui.bootstrap', 'restangular', 'http-auth-interceptor', 'leaflet-directive'])
  .config([  '$stateProvider', '$routeProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$httpProvider',
    function (  $stateProvider, $routeProvider,   $urlRouterProvider , $locationProvider, RestangularProvider, $httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      // $httpProvider.defaults.headers.common['X-myHeader'] = 'customvalue'
      console.log($httpProvider.defaults.headers.common)

      $locationProvider.html5Mode(true);

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

    $routeProvider
      .otherwise({
        redirectTo: '/404'
      });

  $stateProvider
    .state('index', {
      url: "/", // root route
      views: {
          "bodyView": {
              templateUrl: "/static/main.html",
              controller: 'MainCtrl'
          }
      }
    })
    .state('contact', {
      url: '/contact',
      views: {
        "bodyView": {
          templateUrl: "/static/contact.html",
          controller: "ContactCtrl"
        }
      }
    })
    .state('about', {
      url: '/about',
      views: {
          "bodyView": {
            templateUrl: "/static/about.html",
            controller: "AboutCtrl"
          }
      }
    })
    .state('userIndex', {
      url: '/user/{userId}',
      views: {
        "bodyView" : {
          templateUrl: "/static/user/userIndex.html",
          controller: "UserIndexCtrl"
        }
      }
    })
    // .state('404',{
    //   url: '/404',
    //   views: {
    //     "bodyView" : {
    //       templateUrl: "404.html"
    //     }
    //   }

    // })

  }]);
