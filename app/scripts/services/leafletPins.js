'use strict';

angular.module('angularUiTestingApp')
  .factory('leafletPins', [ '$http', function($http) {
    // Service logic
    // ...

    var meaningOfLife = 42;
    var markers = [];

    var m = {};

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

        console.log('distance = ' + d)     
      }
    };
  }]);
