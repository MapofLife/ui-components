angular.module('mol.location-map',['mol-location-map-templates'])
  .directive('molLocationMap', [
    '$q','$state','$http','leafletData', 'leafletBoundsHelpers','$compile',
    function( $q,$state,$http, leafletData, leafletBoundsHelpers,$compile) {

    return {
      restrict: 'AE',
      scope: {
        constraints: '=constraints',
        sidebar: '=sidebar',
        palettes: '=palettes',
        width: '=width',
        height: '=height'
      },
      templateUrl: 'mol-location-map-main.html',
      link: function(scope, element, attr, leafletData  ) {


      },
      controller: function($scope,$state, $http, $element, leafletData, MOLApiX) {

<<<<<<< HEAD
        addResizeListener(
          $element.context,
          function() {
          leafletData.getMap().then(
            function(map) {
              map.invalidateSize();
            }
          );});
=======
          var theMap;
          var utfgridClickHandled = false;
          var showingAllRegions = false;
          console.log($element);
        addResizeListener($element.context,
        function() {
        leafletData.getMap().then(
          function(map) {
            console.log('invalidating');
            map.invalidateSize();
              theMap = map;
          }
        );});
>>>>>>> eacb0e61207f11beef58e575fe3d82c4aedb8a33

        angular.extend($scope,
          {
              drawing: false,
              canceller : $q.defer(),
              markers : {},
              defaults :   {
                minZoom: 2,
                scrollWheelZoom: true
              },
              center : {
                lat: 0,
                lng: 0,
                zoom: 2
              },
              controls : {
                scale:true,
                layers:true,
                draw:{},
                custom:[]
              },
              paths : {},
              bounds : {},
            layers : {
          baselayers: {
            map: {
                name: 'Basic base map',
                type: 'xyz',
                url: 'http://cartodb-basemaps-{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                layerOptions: {
                    subdomains: ['a', 'b', 'c'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    continuousWorld: false

                },
                errorTileUrl: '/app/img/blank_tile.png'
            },
            satellite : {
               name: 'Satellite',
               type: 'xyz',
               url: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
               layerOptions: {
                   attribution: '&copy; <a href="https://www.google.com/copyright">Google</a>',
                   continuousWorld: false

               },
               errorTileUrl: '/app/img/blank_tile.png'
            },
            terrain : {
               name: 'Terrain',
               type: 'xyz',
               url: 'http://mt1.google.com/vt/lyrs=m,t&x={x}&y={y}&z={z}',
               layerOptions: {
                   attribution: '&copy; <a href="https://www.google.com/copyright">Google</a>',
                   continuousWorld: false

               },
               errorTileUrl: '/app/img/blank_tile.png'
            }
          },
          overlays: {}
        }});

        //setRegion and getBounds should probably be a service of
        $scope.setRegion = function(region) {
            var theBounds = getBounds(region);
            region = angular.extend(region, {
                bounds: theBounds
            });
            $scope.constraints.applied.region = region;
            $scope.constraints.selected.region = region;
            $scope.bounds = theBounds;
        };

<<<<<<< HEAD
        $scope.getBounds = function(region) {
              if (region.extent) {
                  return leafletBoundsHelpers.createBoundsFromArray([
                    [region.extent.coordinates[0][2][1], region.extent.coordinates[0][2][0]],
                    [region.extent.coordinates[0][0][1], region.extent.coordinates[0][0][0]]
                ]);
              }
=======
          function getBounds(region) {
              var northEast = L.latLng(region.extent.coordinates[0][2][1], region.extent.coordinates[0][2][0]),
                  southWest = L.latLng(region.extent.coordinates[0][0][1], region.extent.coordinates[0][0][0]),
                  bounds = L.latLngBounds(southWest, northEast);
              bounds = bounds.pad(2);

              var obounds = leafletBoundsHelpers.createBoundsFromArray([
                  [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
                  [bounds.getSouthWest().lat, bounds.getSouthWest().lng]
              ]);

              return obounds;
>>>>>>> eacb0e61207f11beef58e575fe3d82c4aedb8a33
          }

          /**
           * case 1:
           *   if regionId available, draw layer with selected region
           * case 2
           *   if lat and lng available, draw a point with a radius
           * case 3:
           *   if geojson available, draw the geojson polygon (future)
           * case 4:
           *   if regionType (only) available, draw all regions for that type
           */
          $scope.$watch(
<<<<<<< HEAD
              'constraints.applied',
              function(newValue, oldValue) {
                  if (newValue) {
                    $scope.canceller.resolve();
                    $scope.canceller = $q.defer();
                    $scope.updateMap(angular.extend(angular.copy(newValue),
                      {"palette":$scope.constraints.palette,"region":$scope.constraints.region}));
                }
              },true
          );
          $scope.$watch(
              'constraints.palette',
              function(newValue, oldValue) {
                  if (newValue) {
                    $scope.canceller.resolve();
                    $scope.canceller = $q.defer();
                    $scope.updateMap(angular.extend(angular.copy($scope.constraints).applied,{"palette":$scope.constraints.palette,"region":$scope.constraints.region}));
                }
              },true
          );
          $scope.$watch(
            'constraints.region.type',
            function(n,v){
              if(n) {
                try {
                  if(n==='global') {
                    $scope.layers.overlays.regionBoundary.visible=false;
                  } else {
                    $scope.layers.overlays.regionBoundary.visible=true;
                  }
                } catch (e) {}
              }
            }
          )

          $scope.$watch(
              'constraints.applied.regions',
              function(newValue, oldValue) {
                  if (newValue) {
                    $scope.updateBounds();
=======
              'region',
              function(region, oldValue) {

                  if (region.id !== undefined && !showingAllRegions) {
                    // case 1
                      var params = { "id": region.id };
                      if (showingAllRegions) {
                          angular.extend(params,{ "type": region.type });
                      }
                      $http({
                          "withCredentials": false,
                          "method": "POST",
                          "url": "https://mol.cartodb.com/api/v1/map/named/display_region",
                          "data": params
                      }).then(
                          function(result, status, headers, config) {
                              $scope.layers.overlays.region = {
                                  type: "xyz",
                                  url: "//d3dvrpov25vfw0.cloudfront.net/api/v1/map/{0}/{z}/{x}/{y}.png"
                                      .format(result.data.layergroupid),
                                  layerOptions: {
                                      attribution: '©2015 Map of Life',
                                      continuousWorld: false
                                  },
                                  name: 'display_region',
                                  opacity: 0.8,
                                  refresh: true,
                                  doRefresh: true,
                                  errorTileUrl: '/app/img/blank_tile.png',
                                  visible: true
                              };

                              $scope.layers.overlays.shapes = {
                                  visible: false
                              };
                              if ($scope.region.bounds == undefined) {
                                  $scope.region = angular.extend($scope.region, {
                                      bounds: getBounds($scope.region)
                                  });
                              }
                              $scope.bounds = $scope.region.bounds;
                          }
                      );
                  } else if(region.lat !== undefined && region.lng !== undefined) {
                      // case 2
                      $scope.markers = {
                        list: {
                          lat: region.lat,
                          lng: region.lng,
                          layer: 'shapes'
                        }
                      };
                      $scope.center =  {
                        lat: region.lat,
                        lng: region.lng,
                        zoom: 5
                      };

                      $scope.paths.buffer =  {
                            type: 'circle',
                            weight: 2,
                                color: '#ff612f',
                            latlngs: {
                              lat: region.lat,
                              lng: region.lng
                            },
                            radius: 50000,
                            layer: 'shapes'
                      };

                      $scope.layers.overlays.shapes = {
                          visible: true
                      };
                      $scope.layers.overlays.region = {
                        visible: false
                      };
                    } else if (region.geojson !== undefined) {
                      // case 3
                    } else if (region.type !== undefined) {
                      // case 4
                      $http({
                          "withCredentials": false,
                          "method": "POST",
                          "url": "https://mol.cartodb.com/api/v1/map/named/display_region",
                          "data": {
                              "type": region.type,
                              "id": region.id
                          }
                      }).then(
                          function(result, status, headers, config) {
                              $scope.layers.overlays.region = {
                                  type: "cartodbInteractive",
                                  url: "//d3dvrpov25vfw0.cloudfront.net/api/v1/map/{0}/{z}/{x}/{y}.png"
                                      .format(result.data.layergroupid),
                                  layerOptions: {
                                      attribution: '©2015 Map of Life',
                                      continuousWorld: false
                                  },
                                  name: 'display_region',
                                  opacity: 0.8,
                                  refresh: true,
                                  doRefresh: true,
                                  errorTileUrl: '/app/img/blank_tile.png',
                                  visible: true,
                                  key: result.data.layergroupid,
                                  user: 'mol',
                                  layer: '0'
                              };

                              showingAllRegions = true;

                              $scope.layers.overlays.shapes = {
                                  visible: false
                              };
                              $scope.bounds = $scope.region.bounds;
                          }
                      );

                  } else {
                      // reset state
                      $scope.center = {
                          lat: 0,
                          lng: 0,
                          zoom: 2
                      };

>>>>>>> eacb0e61207f11beef58e575fe3d82c4aedb8a33
                  }
                },true
          );



        $scope.updateMap = function(constraints) {

          $scope.layers.overlays.refinedRegion=undefined;
          $http({
              "withCredentials": false,
              "method": "POST",
              "url": "/location/api/mountain_region/map",
              "data": constraints,
              "timeout" : $scope.canceller.promise
          }).then(
              function(result, status, headers, config) {

                  $scope.layers.overlays.refinedRegion = {
                      type: "xyz",
                      url: "https://earthengine.googleapis.com/map/{0}/{z}/{x}/{y}?token={1}"
                          .format(result.data.id,result.data.token),
                      layerOptions: {
                          attribution: '©2015 Map of Life',
                          continuousWorld: false
                      },
                      layerParams: {
                               showOnSelector: false,

                               //transparent: false
                      },
                      name: 'Selected regions',
                      opacity: 1,
                      refresh: true,
                      doRefresh: true,
                      errorTileUrl: '/app/img/blank_tile.png',
                      visible: true
                  };
              }
          );
        }

<<<<<<< HEAD
        $scope.updateBounds = function() {
           var bounds = null;
           angular.forEach(
             $scope.constraints.applied.regions,
             function(region) {
               var extent = JSON.parse(region.extent),
                   regionBounds = L.geoJson(extent).getBounds();
               if(!bounds) {
                 bounds = regionBounds;
               } else {
                 bounds.extend(regionBounds);
=======
          $scope.$on("leafletDirectiveMap.utfgridClick", function(event, args) {
              utfgridClickHandled = true;
              showingAllRegions = true;
              if (args.data != null) {

                  args.data.extent = angular.fromJson(args.data.extent);
                  $scope.region = {
                      id: args.data.id,
                      name: args.data.name,
                      type: 'mountain_region',
                      bounds: getBounds(args.data)
                  };

                  L.popup().setLatLng(args.latlng).setContent(args.data.name).openOn(theMap);
              }
          });

       $scope.$on("leafletDirectiveMap.click", function(event, args){

           if (utfgridClickHandled) {
               utfgridClickHandled = false;
               return;
           }

           var leafEvent = args.leafletEvent;
           $scope.region = {
               lat: Math.round(leafEvent.latlng.lat*1000)/1000,
               lng: Math.round(leafEvent.latlng.lng*1000)/1000
           };

           showingAllRegions = false;
       });

       if($state.params.lat && $state.params.lng) {
           $scope.region = {
               lat: parseFloat($state.params.lat),
               lng: parseFloat($state.params.lng)
           };

       } else if ($state.params.placename) {

           var placename = $state.params.placename;
           if (placename == parseInt(placename)) {
               MOLApiX('searchregion', {id: placename})
                   .then(
                   function (response) {
                       $scope.setRegion(response.data[0]);
                   }
               );
           } else if (placename == 'mountain_region') {
               showingAllRegions = true;
               $scope.region = {
                   type: placename
>>>>>>> eacb0e61207f11beef58e575fe3d82c4aedb8a33
               }
               $scope.bounds = {
                 southWest: bounds.getSouthWest(),
                 northEast: bounds.getNorthEast()
               }
               $scope.constraints.region.bounds = $scope.bounds;

             }
           )
        }

        $scope.$on('leafletDirectiveMap.baselayerchange', function (ev, layer) {


            leafletData.getLayers().then(function (l) {
                angular.forEach(l.baselayers, function (bl) {
                    bl.setZIndex(-1);
                });
            });
        });

        $scope.selectRegion = function(region) {
           var dup = false;
           angular.forEach(
             $scope.constraints.selected.regions,
             function (r) {
                if(r.id == region.id) {dup = true}
           });
           if(!dup) {
             $scope.constraints.selected.regions.push(
               angular.copy(region));
           }
        }

        /*leafletData.getMap().then(function(map) {
          $http.get($scope.sidebar).then(
            function(response) {
              var template = angular.element(response.data);
              var link = $compile(template);
              var element = link($scope);
              var sidebar = L.Control.extend({
                options: {
                  position: 'topleft'
                },
                onAdd: function(map) {
                      return element[0];
                    }
                });
              var control = new sidebar();
              map.addControl(control);
              control.getContainer().addEventListener('mouseover', function () {

                  map.dragging.disable();
                  map.touchZoom.disable();
                  map.doubleClickZoom.disable();
                  map.scrollWheelZoom.disable();
              });
              control.getContainer().addEventListener('mouseout', function () {
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
              });



            }
          );
        });*/

        $scope.$on("leafletDirectiveMap.utfgridClick", function(event, args) {
            if (args.data != null) {
              $scope.selectRegion(args.data);
            }
        });
              /*leafletData.getMap().then(function(map) {

                  /*
                  angular.extend($scope,{"selectedRegion":args.data});
                  var template = angular.element(
                    "<a class='clickable' ng-click='selectRegion()'>"+args.data.name+"</a>"),
                      link = $compile(template),
                      element = link($scope),
                      popup = L.popup({
                        autoPan:false,
                        closeButton:true})
                        .setLatLng(args.latlng)
                        .setContent(element[0])
                        .openOn(map);*/




                /*args.data.extent = angular.fromJson(args.data.extent);
                $scope.constraints = angular.extend(
                  $scope.constraints, {
                    palette : 'tvz',
                    region : {
                    id: args.data.id,
                    name: args.data.name,
                    type: 'mountain_region',
                    bounds: $scope.getBounds(args.data)
                }});

                $scope.bounds = $scope.getBounds(args.data);

            });

*/

      $http({
          "withCredentials": false,
          "method": "POST",
          "url": "https://mol.cartodb.com/api/v1/map/named/display_region",
          "data": {"type":"mountain_region"}

      }).then(
          function(result, status, headers, config) {
              $scope.layers.overlays.regionBoundary = {
                     type: "utfGrid",
                     url: "//d3dvrpov25vfw0.cloudfront.net/api/v1/map/{0}/0/{z}/{x}/{y}.grid.json?callback={cb}"
                         .format(result.data.layergroupid),
                     layerOptions: {
                         attribution: '©2015 Map of Life',
                         continuousWorld: false
                     },
                     layerParams: {
                              showOnSelector: false,
                     },
                     name: "regionGrid",
                     opacity: 0.8,
                     refresh: true,
                     doRefresh: true,
                     errorTileUrl: '/app/img/blank_tile.png',
                     visible: true,
                     key: result.data.layergroupid,
                     user: 'mol',
                     layer: '0'
              };

              //if ($scope.constraints.region.bounds) {
                  //$scope.bounds = $scope.constraints.region.bounds;
                  /*$scope.constraints.region = angular.extend(constraints.region, {
                      bounds: getBounds(constraints.region)
                  });*/
              //}
          }
      );

    /*  $http({
          "withCredentials": false,
          "method": "POST",
          "url": "/api/mountain_region/map",
          "data": {"palette":"region"}
      }).then(
          function(result, status, headers, config) {

              $scope.layers.overlays.allRegions = {
                  type: "xyz",
                  url: "https://earthengine.googleapis.com/map/{0}/{z}/{x}/{y}?token={1}"
                      .format(result.data.id,result.data.token),
                  layerOptions: {
                      attribution: '©2015 Map of Life',
                      continuousWorld: false
                  },
                  layerParams: {
                           showOnSelector: true,

                           //transparent: false
                  },
                  name: 'All mountain regions',
                  opacity: 1,
                  refresh: true,
                  doRefresh: true,
                  errorTileUrl: '/app/img/blank_tile.png',
                  visible: true
              };
          }
      );
*/
      /*  $scope.$on("leafletDirectiveMap.utfgridMouseover",
          function(event, args) {
            if (args.data != null ) {
              $scope.statistics.hover = args.data.name;
              leafletData.getMap().then(function(map) {
                  $scope.popup = L.popup({
                    autoPan:false,
                    closeButton:false})
                      .setLatLng(args.latlng)
                      .setContent(args.data.name)
                      .openOn(map);
                 }
              );
            }
        });
        $scope.$on("leafletDirectiveMap.utfgridMouseout",
          function(event, args) {
            if (args.data != null ) {
              $scope.statistics.hover = undefined;
              $scope.popup = undefined;
            }
        });*/
      /*  leafletData.getMap().then(function(map) {
               leafletData.getLayers().then(function(baselayers) {
                  var
                      drawControl = new L.Control.Draw({
                      edit: {
                          featureGroup: drawnItems,
                          edit: false,
                          remove: false
                      },
                      draw: {
                        rectangle: false,
                        polyline: false,
                        circle: false,
                        marker: false
                      },
                      position: 'topleft',

                  });
                  map.on("draw:editstart", function(e) {
                    $scope.drawing = true;
                  });

                  map.on('draw:created', function (e) {
                    var layer = e.layer, bounds = {
                      "southWest": drawnItems.getBounds().getSouthWest(),
                      "northEast": drawnItems.getBounds().getNorthEast()};

                    //drawnItems.addLayer(layer);

                    $scope.drawing =false;
                    $scope.constraints.region = {
                      "geojson" : layer.toGeoJSON(),
                      "name" : null,
                      "bounds" : bounds
                    }
                  });
                  map.addControl(drawControl);
               });
           });*/
      }
    };
}]);
