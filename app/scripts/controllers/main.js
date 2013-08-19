'use strict';

angular.module('angularUiTestingApp')
  .controller('MainCtrl', function ($scope, leafletPins) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    console.log('main controller was called')


    		$scope.london =  {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                }

            // angular.extend($scope, {
            //     london: {
            //         lat: 51.505,
            //         lng: -0.09,
            //         zoom: 8
            //     },
            //     markers: {}
            // });

            // $scope.addMarkers = function() {
            //     angular.extend($scope, {
            //         markers: {
            //             m1: {
            //                 lat: 51.505,
            //                 lng: -0.09,
            //                 message: "I'm a static marker",
            //             },
            //             m2: {
            //                 lat: 51,
            //                 lng: 0,
            //                 focus: true,
            //                 message: "Hey, drag me if you want",
            //                 draggable: true
            //             }
            //         }
            //     });
            // };

            	//original markers
            // $scope.markers = {
            //             m1: {
            //                 lat: 51.505,
            //                 lng: -0.09,
            //                 message: "I'm a static marker",
            //                 draggable: true
            //             },
            //             m2: {
            //                 lat: 51,
            //                 lng: 0,
            //                 focus: true,
            //                 message: "Hey, drag me if you want",
            //                 draggable: true
            //             }
            //         }

            $scope.markers =  {
                        m1 : {
                            lat: 51.50,
                            lng: -0.082,
                            draggable: true
                        },
                        m2: {
                            lat: 51,
                            lng: -0.09,
                            draggable: true
                        }
                    }


            $scope.circles = {
            	hey: 'data'
            }

                angular.extend($scope, {
                    paths: {
                        p2: {
                            weight: 3,
                            opacity: 0.5,
                            latlngs: [ $scope.markers.m1, $scope.markers.m2 ]
                        }
                    }
                });


            $scope.removeMarkers = function() {
                $scope.markers = {};
            }

            // $scope.addMarkers();
            // console.log('markers = ' + JSON.stringify($scope.markers.m1))
            // leafletPins.addMarker($scope.markers.m1)
            // leafletPins.addMarker($scope.markers.m2)
            // leafletPins.showMarkers();

            leafletPins.initMarkers($scope.markers)
            // leafletPins.updateMarker('m1',$scope.markers.m1 )
            // leafletPins.updateMarker('m2',$scope.markers.m2 )

  });


