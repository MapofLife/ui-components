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
      controller: function($scope,$state, $http, $element, leafletData) {

        addResizeListener(
          $element.context,
          function() {
          leafletData.getMap().then(
            function(map) {
              map.invalidateSize();
            }
          );});

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

                layers:true,
                //draw:{},
                scale:true,
                //custom:[]
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

        $scope.getBounds = function(region) {
              if (region.extent) {
                  return leafletBoundsHelpers.createBoundsFromArray([
                    [region.extent.coordinates[0][2][1], region.extent.coordinates[0][2][0]],
                    [region.extent.coordinates[0][0][1], region.extent.coordinates[0][0][0]]
                ]);
              }
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
              'constraints.applied',
              function(newValue, oldValue) {
                  if (newValue) {
                    $scope.canceller.resolve();
                    $scope.canceller = $q.defer();
                    $scope.updateMap(
                      angular.extend(
                        angular.copy(newValue),
                          {"palette":$scope.constraints.palette,
                          "region":$scope.constraints.region}));
                }
              },true
          );
          $scope.$watch(
              'constraints.palette',
              function(newValue, oldValue) {
                  if (newValue) {
                    $scope.canceller.resolve();
                    $scope.canceller = $q.defer();
                    $scope.updateMap(
                      angular.extend(
                        angular.copy($scope.constraints)
                          .applied, {
                            "palette": $scope.constraints.palette,
                            "region": $scope.constraints.region
                          }));
                }
              },true
          );
          $scope.$watch(
            'constraints.outline',
            function(n,v){
              $scope.layers.overlays.regionBoundary.visible=n;
            }
          )

          $scope.$watch(
              'constraints.applied.regions',
              function(newValue, oldValue) {
                  if (newValue) {
                    $scope.updateBounds();
                  }
                },true
          );

        $scope.addHillshade = function() {
          $http({
              "withCredentials": false,
              "method": "GET",
              "url": "/api/hillshade"
          }).then(
              function(result, status, headers, config) {

                  $scope.layers.overlays.hillshade = {
                      type: "xyz",
                      url: "https://earthengine.googleapis.com/map/{0}/{z}/{x}/{y}?token={1}"
                          .format(result.data.id,result.data.token),
                      layerOptions: {
                          attribution: '©2015 Map of Life',
                          continuousWorld: false
                      },
                      layerParams: {
                               showOnSelector: true,

                               transparent: true
                      },
                      name: 'Hillshade',
                      opacity: 0.8,
                      refresh: true,
                      errorTileUrl: '/app/img/blank_tile.png',
                      visible: true
                  };
              }
          );
        }



        $scope.updateMap = function(constraints) {

          $scope.layers.overlays.refinedRegion=undefined;
          $http({
              "withCredentials": false,
              "method": "POST",
              "url": "/api/mountain_region/map",
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

        $scope.updateBounds = function() {
           var bounds = null;
           if($scope.constraints.applied.regions.length>0) {
             angular.forEach(
               $scope.constraints.applied.regions,
               function(region) {
                 var extent = JSON.parse(region.extent),
                     regionBounds = L.geoJson(extent).getBounds();
                 if(!bounds) {
                   bounds = regionBounds;
                 } else {
                   bounds.extend(regionBounds);
                 }
                 $scope.bounds = {
                   southWest: bounds.getSouthWest(),
                   northEast: bounds.getNorthEast()
                 }
                 $scope.constraints.region.bounds = $scope.bounds;

               }
             );
           } else {
             bounds = L.geoJson($scope.constraints.region.extent).getBounds();
             $scope.bounds = {
               southWest: bounds.getSouthWest(),
               northEast: bounds.getNorthEast()
             }
           }
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


        $scope.$on("leafletDirectiveMap.utfgridMouseover", function(event, args) {
            if (args.data != null) {
              $scope.interactivity = args.data;
            } else {
              $scope.interactivity = undefined;
            }
        });


      $http({
          "withCredentials": false,
          "method": "POST",
          "url": "https://mol.cartodb.com/api/v1/map/named/gmba-terrain-map",
          "data": {"type":"mountain_region"}

      }).then(
          function(result, status, headers, config) {
             $scope.layers.overlays.regionBoundary = {
                   type: "xyz",
                   url: "//d3dvrpov25vfw0.cloudfront.net/api/v1/map/{0}/{z}/{x}/{y}.png"
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
                   visible: $scope.constraints.outline,
                   key: result.data.layergroupid,
                   user: 'mol',
                   layer: '0'
                 };
              $scope.layers.overlays.regionBoundaryGrid = {
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
          }
      );

      $scope.addHillshade();

      }
    };
}]);
