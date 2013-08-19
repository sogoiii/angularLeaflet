'use strict';

angular.module('angularUiTestingApp')
  .factory('leafletPins', [ '$http', '$q', function($http, $q) {
    // Service logic
    // ...

    // $http.defaults.useXDomain = true;

    var meaningOfLife = 42;
    var markers = [];
    var cloudMadeAPIKey = 'ab23be50c54b453aa7abf862ce589286';
    var m = {};


    var routeData = ''

    //custom numbers prototype
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }

    // Public API here
    return {
      someMethod: function() {
        return meaningOfLife;
      },
      initMarkers: function(markers) {
        m = markers
      },
      updateMarker: function(name, marker){
        m[name].lat = marker._latlng.lat
        m[name].lng = marker._latlng.lng
        console.log(m)
      },
      showMarkers: function(){
        console.log('markers are below');
        console.log(markers)
      },
      computeDistance: function(){
        // var R = 6371; // km
        var R = 3963.1676 //miles
        var dLat = (m.m1.lat-m.m2.lat).toRad();
        var dLon = (m.m1.lng-m.m2.lng).toRad();
        var lat1 = m.m2.lat.toRad();
        var lat2 = m.m1.lat.toRad();

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;   

        // console.log('distance = ' + d)     
      },

      routePoints: function(){
        // console.log('going to make a request to cloiudmade')
        // $http.get('http://routes.cloudmade.com/ab23be50c54b453aa7abf862ce589286/api/0.3/47.25976,9.58423,47.26117,9.59882/car/shortest.js')
        
        // console.log($http.defaults.headers)
        var deferred = $q.defer();
        $http({
            method: 'JSONP', 
            url: 'http://routes.cloudmade.com/ab23be50c54b453aa7abf862ce589286/api/0.3/51.4360324,0.12634277,51.47026338,0.06465446/car/shortest.js?callback=JSON_CALLBACK'
    //         headers:  {
    //     'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
    //     'Accept': 'application/json;odata=verbose',
    //     "X-Testing" : "testing"
    // }
          })  
          .success(function(data, status, headers, config){
            console.log('service received route data')
            // console.log(data)
            routeData = data;
            deferred.resolve(data);
            
          })
          .error(function(data, status, headers, config){
            console.log('service failed to get route data')
          })


          return deferred.promise;
     },//endo f routePoints









    };
  }]);
