var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive('leaflet', [
    '$http', '$log', '$parse', '$rootScope', 'leafletPins', function ($http, $log, $parse, $rootScope, leafletPins) {

    var defaults = {
        maxZoom: 14,
        minZoom: 1,
        doubleClickZoom: true,
        tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileLayerOptions: {
            attribution: 'Tiles &copy; Open Street Maps'
        },
        icon: {
            url: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon.png',
            retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon@2x.png',
            size: [25, 41],
            anchor: [12, 40],
            popup: [0, -40],
            shadow: {
                url: 'http://cdn.leafletjs.com/leaflet-0.5.center1/images/marker-shadow.png',
                retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
                size: [41, 41],
                anchor: [12, 40]
            }
        },
        path: {
            weight: 10,
            opacity: 1,
            color: '#0000ff'
        }
    };

    var str_inspect_hint = 'Add testing="testing" to <leaflet> tag to inspect this object';

    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            maxBounds: '=maxbounds',
            bounds: '=bounds',
            marker: '=marker',
            markers: '=markers',
            defaults: '=defaults',
            paths: '=paths',
            circles: '=circles',
            tiles: '=tiles',
            events: '=events'
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function (scope, element, attrs /*, ctrl */) {
            // console.log(scope.center)
            var centerModel = {
                lat:$parse("center.lat"),
                lng:$parse("center.lng"),
                zoom:$parse("center.zoom")
            };

            if (attrs.width) {
                element.css('width', attrs.width);
            }
            if (attrs.height) {
                element.css('height', attrs.height);
            }


            scope.leaflet = {};

            scope.leaflet.maxZoom = !!(attrs.defaults && scope.defaults && scope.defaults.maxZoom) ?
                parseInt(scope.defaults.maxZoom, 10) : defaults.maxZoom;
            scope.leaflet.minZoom = !!(attrs.defaults && scope.defaults && scope.defaults.minZoom) ?
                parseInt(scope.defaults.minZoom, 10) : defaults.minZoom;
            scope.leaflet.doubleClickZoom = !!(attrs.defaults && scope.defaults && (typeof(scope.defaults.doubleClickZoom) == "boolean") ) ? scope.defaults.doubleClickZoom  : defaults.doubleClickZoom;

            var map = new L.Map(element[0], {
                maxZoom: scope.leaflet.maxZoom,
                minZoom: scope.leaflet.minZoom,
                doubleClickZoom: scope.leaflet.doubleClickZoom
            });

           map.setView([0, 0], 1);

            scope.leaflet.tileLayer = !!(attrs.defaults && scope.defaults && scope.defaults.tileLayer) ?
                scope.defaults.tileLayer : defaults.tileLayer;
            scope.leaflet.map = !!attrs.testing ? map : str_inspect_hint;

            setupTiles();
            setupCenter();
            setupMaxBounds();
            setupBounds();
            setupMainMaerker();
            setupMarkers();
            // setupPaths();
            setupEvents();
            setupCircles();


            // use of leafletDirectiveSetMap event is not encouraged. only use
            // it when there is no easy way to bind data to the directive
            scope.$on('leafletDirectiveSetMap', function(event, message) {
                var meth = message.shift();
                map[meth].apply(map, message);
            });

            scope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    scope.$eval(fn);
                } else {
                    scope.$apply(fn);
                }
            };

             /*
              * Event setup watches for callbacks set in the parent scope
              *
              *    scope.events = {
              *      dblclick: function(){
              *         // doThis()
              *      },
              *      click: function(){
              *         // doThat()
              *      }
              * }
              * */

             function setupEvents(){
                 if ( typeof(scope.events) != 'object'){
                     return false;
                 }else{
                     for (var bind_to  in scope.events){
                         map.on(bind_to,scope.events[bind_to]);
                     }
                 }
             }

            function setupTiles(){
                 // TODO build custom object for tiles, actually only the tile string
                 if (scope.defaults && scope.defaults.tileLayerOptions) {
                    for (var key in scope.defaults.tileLayerOptions) {
                        defaults.tileLayerOptions[key] = scope.defaults.tileLayerOptions[key];
                    }
                }

                if (scope.tiles) {
                    if (scope.tiles.tileLayer) {
                        scope.leaflet.tileLayer = scope.tiles.tileLayer;
                    }
                    if (scope.tiles.tileLayerOptions.attribution) {
                        defaults.tileLayerOptions.attribution = scope.tiles.tileLayerOptions.attribution;
                    }
                }

                var tileLayerObj = L.tileLayer(
                    scope.leaflet.tileLayer, defaults.tileLayerOptions);
                tileLayerObj.addTo(map);

                scope.leaflet.tileLayerObj = !!attrs.testing ? tileLayerObj : str_inspect_hint;
            }

            function setupMaxBounds() {
                if (!scope.maxBounds) {
                    return;
                }
                if (scope.maxBounds.southWest && scope.maxBounds.southWest.lat && scope.maxBounds.southWest.lng && scope.maxBounds.northEast && scope.maxBounds.northEast.lat && scope.maxBounds.northEast.lng) {
                    map.setMaxBounds(
                        new L.LatLngBounds(
                            new L.LatLng(scope.maxBounds.southWest.lat, scope.maxBounds.southWest.lng),
                            new L.LatLng(scope.maxBounds.northEast.lat, scope.maxBounds.northEast.lng)
                        )
                    );

                    scope.$watch("maxBounds", function (maxBounds) {
                        if (maxBounds.southWest && maxBounds.northEast && maxBounds.southWest.lat && maxBounds.southWest.lng && maxBounds.northEast.lat && maxBounds.northEast.lng) {
                            map.setMaxBounds(
                                new L.LatLngBounds(
                                    new L.LatLng(maxBounds.southWest.lat, maxBounds.southWest.lng),
                                    new L.LatLng(maxBounds.northEast.lat, maxBounds.northEast.lng)
                                )
                            );
                        }
                    });
                }
            }

            function tryFitBounds(bounds) {
                if (bounds) {
                    var southWest = bounds.southWest;
                    var northEast = bounds.northEast;
                    if (southWest && northEast && southWest.lat && southWest.lng && northEast.lat && northEast.lng) {
                        var sw_latlng = new L.LatLng(southWest.lat, southWest.lng);
                        var ne_latlng = new L.LatLng(northEast.lat, northEast.lng);
                        map.fitBounds(new L.LatLngBounds(sw_latlng, ne_latlng));
                    }
                }
            }

            function setupBounds() {
                if (!scope.bounds) {
                    return;
                }
                scope.$watch('bounds', function (new_bounds) {
                    tryFitBounds(new_bounds);
                });
            }

            function setupCenter() {
                scope.$watch("center", function (center) {
                    if (!center) {
                        $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                        return;
                    }
                    if (center.lat && center.lng && center.zoom) {
                        map.setView([center.lat, center.lng], center.zoom);
                    } else if (center.autoDiscover === true) {
                        map.locate({ setView: true, maxZoom: scope.leaflet.maxZoom });
                    }
                }, true);

                map.on("dragend", function (/* event */) {
                    scope.safeApply(function (scope) {
                        centerModel.lat.assign(scope, map.getCenter().lat);
                        centerModel.lng.assign(scope, map.getCenter().lng);
                    });
                });

                map.on("zoomend", function (/* event */) {
                    if(angular.isUndefined(scope.center)){
                        $log.warn("[AngularJS - Leaflet] 'center' is undefined in the current scope, did you forget to initialize it?");
                    }
                    if (angular.isUndefined(scope.center) || scope.center.zoom !== map.getZoom()) {
                        scope.safeApply(function (s) {
                            centerModel.zoom.assign(s, map.getZoom());
                            centerModel.lat.assign(s, map.getCenter().lat);
                            centerModel.lng.assign(s, map.getCenter().lng);
                        });
                    }
                });
            }

            function setupMainMaerker() {
                var main_marker;
                if (!scope.marker) {
                    return;
                }
                main_marker = createMarker('marker', scope.marker, map);
                scope.leaflet.marker = !!attrs.testing ? main_marker : str_inspect_hint;
                main_marker.on('click', function(e) {
                    $rootScope.$apply(function() {
                        $rootScope.$broadcast('leafletDirectiveMainMarkerClick');
                    });
                });
            }

            function setupMarkers() {
                var markers = {};
                scope.leaflet.markers = !!attrs.testing ? markers : str_inspect_hint;
                if (!scope.markers) {
                    return;
                }

                function genMultiMarkersClickCallback(m_name) {
                    return function(e) {
                        $rootScope.$apply(function() {
                            $rootScope.$broadcast('leafletDirectiveMarkersClick', m_name);
                        });
                    };
                }

                for (var name in scope.markers) {
                    markers[name] = createMarker('markers.'+name, scope.markers[name], map, name);
                    markers[name].on('click', genMultiMarkersClickCallback(name));
                }

                scope.$watch('markers', function(newMarkers) {
                    // Delete markers from the array
                    for (var name in markers) {
                        if (newMarkers[name] === undefined) {
                            delete markers[name];
                        }
                    }
                    // add new markers
                    for (var new_name in newMarkers) {
                        if (markers[new_name] === undefined) {
                            markers[new_name] = createMarker(
                                'markers.'+new_name, newMarkers[new_name], map, new_name);
                            markers[new_name].on('click', genMultiMarkersClickCallback(new_name));
                        }
                    }
                }, true);
            }


            var routeLine = 'undefined'
            function createMarker(scope_watch_name, marker_data, map, subName) {
                var marker = buildMarker(marker_data);
                map.addLayer(marker);

                if (marker_data.focus === true) {
                    marker.openPopup();
                }
                
                marker.on("dragend", function () {
                    console.log('I dropped the pin')
                    leafletPins.updateMarker(subName, marker)
                    leafletPins.computeDistance();
                    
                    // scope.route = 'a new value' + Math.random()//can be removed, only done to test that the watch routs functions iscalled...it is

                    // setupRoute();

                    routeData = leafletPins.routePoints();


                    routeData.then(function(data){
                        scope.route = data

                    })

                    
                    // routeData.then(function(data){
                    //     console.log('success promise')
                    //     console.log(routeLine)

                    //     if(typeof routeLine !== 'undefined'){
                    //         console.log('type of routline is not undefined')
                    //         map.removeLayer(routeLine)
                    //     } else {
                    //         console.log('route line is undefined')
                    //     }

                    //     // console.log('routeData = ' + JSON.stringify(routeData))
                    //     console.log(data)

                    //     if(data.status == 207){
                    //         console.log('failed to find a path, hence will not draw directions')
                    //         return 
                    //     }                        






                                // var routeLineWatch = scope.$watch(routeLine, function (data, oldData) {
                                //     console.log('watch routLine was called')
                                //     console.log(data)
                                //     console.log(oldData)
                                //     if (!data) {
                                //         console.log('will be removing a layer')
                                //         map.removeLayer(routeLine);
                                //         routeLineWatch();
                                //         return;
                                //     }

                                //     if (oldData) {
                                //         if (data.latlngs !== undefined && data.latlngs !== oldData.latlngs) {
                                //             var latlngs = convertToLeafletLatLngs(data.latlngs);
                                //             routeLine.setLatLngs(latlngs);
                                //         }

                                //         if (data.weight !== undefined && data.weight !== oldData.weight) {
                                //             routeLine.setStyle({ weight: data.weight });
                                //         }

                                //         if (data.color !== undefined && data.color !== oldData.color) {
                                //             routeLine.setStyle({ color: data.color });
                                //         }

                                //         if (data.opacity !== undefined && data.opacity !== oldData.opacity) {
                                //             routeLine.setStyle({ opacity: data.opacity });
                                //         }
                                //     }
                                // }, true);





                        // var test = convertRouteToLeafletLatLngs(data.route_geometry)
                        // console.log(test)
                                // var routePath = {
                                //     latlngs : test,
                                //     weight: 3,
                                //     opacity: 0.5,
                                // }

                                // var routeLine = new L.Polyline([], {
                                //     weight: defaults.path.weight,
                                //     color: defaults.path.color,
                                //     opacity: defaults.path.opacity
                                // });

                                // if (routePath.latlngs !== undefined) {
                                //     var latlngs = convertToLeafletLatLngs(routePath.latlngs);
                                //     routeLine.setLatLngs(latlngs);
                                // }

                                // if (routePath.weight !== undefined) {
                                //     routeLine.setStyle({ weight: routePath.weight });
                                // }

                                // if (routePath.color !== undefined) {
                                //     routeLine.setStyle({ color: routePath.color });
                                // }

                                // if (routePath.opacity !== undefined) {
                                //     routeLine.setStyle({ opacity: routePath.opacity });
                                // }

                                // map.addLayer(routeLine);









                    // }, function(data){
                    //     console.log('failed promise')
                    // })
                    




                    // currentCircle
                    // map.removeLayer(routeLine)
                    map.removeLayer(currentCircle)
                    createCircleAtMarker(scope_watch_name, marker_data, map, subName)


                    scope.safeApply(function (scope) {
                        marker_data.lat = marker.getLatLng().lat;
                        marker_data.lng = marker.getLatLng().lng;
                    });
                    if (marker_data.message) {
                        marker.openPopup();
                    }
                });

                var clearWatch = scope.$watch(scope_watch_name, function (data, old_data) {
                    if (!data) {
                        map.removeLayer(marker);
                        clearWatch();
                        return;
                    }

                    if (old_data) {
                        if (data.draggable !== undefined && data.draggable !== old_data.draggable) {
                            if (data.draggable === true) {
                                marker.dragging.enable();
                            } else {
                                marker.dragging.disable();
                            }
                        }

                        if (data.focus !== undefined && data.focus !== old_data.focus) {
                            if (data.focus === true) {
                                marker.openPopup();
                            } else {
                                marker.closePopup();
                            }
                        }

                        if (data.message !== undefined && data.message !== old_data.message) {
                            marker.bindPopup(data);
                        }

                        if (data.lat !== old_data.lat || data.lng !== old_data.lng) {
                            marker.setLatLng(new L.LatLng(data.lat, data.lng));
                        }

                        if (data.icon && data.icon !== old_data.icon) {
                            marker.setIcon(data.icon);
                        }
                    }
                }, true);
                return marker;
            }

            function buildMarker(data) {
                var micon = null;
                if (data.icon) {
                    micon = data.icon;
                } else {
                    micon = buildIcon();
                }
                var marker = new L.marker(data,
                    {
                        icon: micon,
                        draggable: data.draggable ? true : false
                    }
                );
                if (data.message) {
                    marker.bindPopup(data.message);
                }
                return marker;
            }

            function buildIcon() {
                return L.icon({
                    iconUrl: defaults.icon.url,
                    iconRetinaUrl: defaults.icon.retinaUrl,
                    iconSize: defaults.icon.size,
                    iconAnchor: defaults.icon.anchor,
                    popupAnchor: defaults.icon.popup,
                    shadowUrl: defaults.icon.shadow.url,
                    shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
                    shadowSize: defaults.icon.shadow.size,
                    shadowAnchor: defaults.icon.shadow.anchor
                });
            }

            setupRoute()

            function setupRoute() {
                console.log('setupRoute was called')
                var route = {};
                // scope.routes = route;
                scope.route = route;

                if (!scope.route) {
                    console.log('will return because scope.route does not exist')
                    return;
                }

                for (var name in scope.paths) {
                    route[name] = createRoute(name, scope.paths[name], map);
                }

                // leafletPins.setRouteObject(route)

                console.log('!!!!!!!!!!!!!!')
                console.log(route)
                map.removeLayer(route.p2)
                scope.$watch("route", function (newRoute) {
                    console.log('the route variable has changed')
                    console.log(newRoute)

                    if(newRoute.status != 0){
                        console.log('failed to find a path, hence will not draw directions')
                        return 
                    }      
                    // leafletPins.routePathRemove(map);
                    map.removeLayer(route)
                    console.log(route)

                    // map.removeLayer(route)

                    // for( var name in scope.routes){
                        newRoute = convertRouteToLeafletLatLngs(newRoute.route_geometry)
                       route = createRoute(name, newRoute, map)
                    // }



                    // for (var new_name in newRoute) {
                    //     if (route[new_name] === undefined) {
                    //         route[new_name] = createRoute(new_name, newRoute[new_name], map);
                    //     }
                    // }
                    // // Delete paths from the array
                    // for (var name in route) {
                    //     if (newRoute[name] === undefined) {
                    //         delete route[name];
                    //     }
                    // }

                });
            };//end of setup Route


            function createRoute(name, test, map) {
                console.log('will now create the route on the map')
                // console.log()

                console.log(test.weight)
                if(typeof(test.weight) !== 'undefined' ){
                    console.log('weight exists, hence its the first call')
                    routePath = test;
                }
                else {
                    var routePath = {
                        latlngs : test,
                        weight: 3,
                        opacity: 0.5,
                    }
                }
                var routeLine = new L.Polyline([], {
                    weight: defaults.path.weight,
                    color: defaults.path.color,
                    opacity: defaults.path.opacity
                });

                if (routePath.latlngs !== undefined) {
                    var latlngs = convertToLeafletLatLngs(routePath.latlngs); //had to change because i updated the object before i entered this function
                    routeLine.setLatLngs(latlngs);
                }

                if (routePath.weight !== undefined) {
                    routeLine.setStyle({ weight: routePath.weight });
                }

                if (routePath.color !== undefined) {
                    routeLine.setStyle({ color: routePath.color });
                }

                if (routePath.opacity !== undefined) {
                    routeLine.setStyle({ opacity: routePath.opacity });
                }

                map.addLayer(routeLine);

                // var clearWatch = scope.$watch('routes.' + name, function (data, oldData) {
                //     console.log('clearWatch for routes was called')
                //     if (!data) {
                //         map.removeLayer(routeLine);
                //         clearWatch();
                //         return;
                //     }

                //     if (oldData) {
                //         if (data.latlngs !== undefined && data.latlngs !== oldData.latlngs) {
                //             var latlngs = convertToLeafletLatLngs(data.latlngs);
                //             routeLine.setLatLngs(latlngs);
                //         }

                //         if (data.weight !== undefined && data.weight !== oldData.weight) {
                //             routeLine.setStyle({ weight: data.weight });
                //         }

                //         if (data.color !== undefined && data.color !== oldData.color) {
                //             routeLine.setStyle({ color: data.color });
                //         }

                //         if (data.opacity !== undefined && data.opacity !== oldData.opacity) {
                //             polyline.setStyle({ opacity: data.opacity });
                //         }
                //     }
                // }, true);

                return routeLine             
            }


            function setupPaths() {
                var paths = {};
                scope.leaflet.paths = !!attrs.testing ? paths : str_inspect_hint;

                if (!scope.paths) {
                    return;
                }

                $log.warn("[AngularJS - Leaflet] Creating polylines and adding them to the map will break the directive's scope's inspection in AngularJS Batarang");

                for (var name in scope.paths) {
                    paths[name] = createPath(name, scope.paths[name], map);
                }
                console.log(paths)

                scope.$watch("paths", function (newPaths) {
                    console.log('paths variable has changed')
                    // for (var new_name in newPaths) {
                    //     if (paths[new_name] === undefined) {
                    //         paths[new_name] = createPath(new_name, newPaths[new_name], map);
                    //     }
                    // }
                    // // Delete paths from the array
                    // for (var name in paths) {
                    //     if (newPaths[name] === undefined) {
                    //         delete paths[name];
                    //     }
                    // }

                }, true);
            }

            function createPath(name, scopePath, map) {
                var polyline = new L.Polyline([], {
                    weight: defaults.path.weight,
                    color: defaults.path.color,
                    opacity: defaults.path.opacity
                });

                if (scopePath.latlngs !== undefined) {
                    var latlngs = convertToLeafletLatLngs(scopePath.latlngs);
                    polyline.setLatLngs(latlngs);
                }

                if (scopePath.weight !== undefined) {
                    polyline.setStyle({ weight: scopePath.weight });
                }

                if (scopePath.color !== undefined) {
                    polyline.setStyle({ color: scopePath.color });
                }

                if (scopePath.opacity !== undefined) {
                    polyline.setStyle({ opacity: scopePath.opacity });
                }

                map.addLayer(polyline);

                var clearWatch = scope.$watch('paths.' + name, function (data, oldData) {
                    if (!data) {
                        map.removeLayer(polyline);
                        clearWatch();
                        return;
                    }

                    if (oldData) {
                        if (data.latlngs !== undefined && data.latlngs !== oldData.latlngs) {
                            var latlngs = convertToLeafletLatLngs(data.latlngs);
                            polyline.setLatLngs(latlngs);
                        }

                        if (data.weight !== undefined && data.weight !== oldData.weight) {
                            polyline.setStyle({ weight: data.weight });
                        }

                        if (data.color !== undefined && data.color !== oldData.color) {
                            polyline.setStyle({ color: data.color });
                        }

                        if (data.opacity !== undefined && data.opacity !== oldData.opacity) {
                            polyline.setStyle({ opacity: data.opacity });
                        }
                    }
                }, true);
                return polyline;
            }

            function convertToLeafletLatLngs(latlngs) {
                var leafletLatLngs = latlngs.filter(function (latlng) {
                    return !!latlng.lat && !!latlng.lng;
                }).map(function (latlng) {
                    return new L.LatLng(latlng.lat, latlng.lng);
                });

                return leafletLatLngs;
            }


            function convertRouteToLeafletLatLngs(latlngs){
                var leafletLatLngs = latlngs.map(function(element){
                        return new L.LatLng(element[0], element[1])
                })
                return leafletLatLngs
            }


            function setupCircles(){
                console.log('setup circles called')
                var circles = {};
                if (!scope.circles) {
                    return;
                }
                console.log('going to call my funtion')
                createCircle();
                // for (var name in scope.circles) {
                //     circles[name] = createCircle(name, scope.circles[name], map);
                // }
            }

            function createCircle(){
                console.log('creating circle')
                var circle = L.circle([51.508, -0.11], 500, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5
                }).addTo(map);


            }//end of addCircle

            var currentCircle = 'undefined'

            function createCircleAtMarker(scope_watch_name, marker_data, map, subName){
                // console.log('ill be creating a circle at this spot')
                // console.log(marker_data)
                currentCircle = L.circle([marker_data.lat, marker_data.lng], 500,
                {
                    color: 'blue',
                    fillColor: '#f03',
                    fillOpacity: 0.5

                }).addTo(map)

            }



var MyControl = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'leaflet-control-command-interior');

        // var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
        L.DomEvent
            .addListener(container, 'click', L.DomEvent.stopPropagation)
            .addListener(container, 'click', L.DomEvent.preventDefault)
            .addListener(container, 'click', function () { MapShowCommand(); });
        // ... initialize other DOM elements, add listeners, etc.

        return container;
    }
});

map.addControl(new MyControl());


// // var cmAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade', cmUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png';
// // mapLayersList = [ L.tileLayer(cmUrl, {styleId: 22677, attribution: cmAttr}), L.tileLayer(cmUrl, {styleId: 999,   attribution: cmAttr}), L.tileLayer(cmUrl, {styleId: 46561, attribution: cmAttr})]
// // var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// var street_layer = new L.TileLayer(null, {minZoom: 8, maxZoom: 18});

// var baseMaps = {"Streets": street_layer};
// L.control.layers(baseMaps, null ).addTo(map);

                        // function addControls() {
                        //  var commandControl = new L.Control.Command({});
                        //     map.addControl(commandControl);
                        // }
          

                        function MapShowCommand() {
                            console.log('custom button was clicked')
                          // alert("debugging");
                        }

                        // L.Control.Command = L.Control.extend({
                        //     options: {
                        //         position: 'topleft',
                        //     },

                        //     onAdd: function (map) {
                        //         var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
                        //         L.DomEvent
                        //             .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                        //             .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
                        //         .addListener(controlDiv, 'click', function () { MapShowCommand(); });

                        //         var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
                        //         controlUI.title = 'Map Commands';
                        //         return controlDiv;
                        //     }
                        // });

                        // L.control.command = function (options) {
                        //     return new L.Control.Command(options);
                        // };
        }//end of link
    };
}]);
