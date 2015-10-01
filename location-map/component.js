angular.module('mol.location-map',['mol-location-map-templates'])
  .directive('molLocationMap', [
    'MOLApiX','$state','$http','leafletData', 'leafletBoundsHelpers',
    function(MOLApiX, $state,$http, leafletData, leafletBoundsHelpers) {

    return {
      restrict: 'AE',
      scope: {
        region: '=region',
        width: '=width',
        height: '=height'
      },
      templateUrl: 'mol-location-map-main.html',
      link: function(scope, element, attr, leafletData  ) {


      },
      controller: function($scope,$state, $http, $element, leafletData, MOLApiX) {

        console.log($element);
        addResizeListener($element.context,
        function() {
        leafletData.getMap().then(
          function(map) {
            console.log('invalidating');
            map.invalidateSize();
          }
        );});

        $scope.markers = {};
        $scope.defaults = {
          scrollWheelZoom: false
        };
        $scope.center = {
                lat: 0,
                lng: 0,
                zoom: 2
              };
        $scope.paths = {};
        //$scope.location = {};
        $scope.region = {};
        $scope.bounds = {};
        $scope.layers = {
          baselayers: {
            positron: {
                name: 'Positron',
                type: 'xyz',
                url: 'http://cartodb-basemaps-{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                layerOptions: {
                    subdomains: ['a', 'b', 'c'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    continuousWorld: false

                },
                errorTileUrl: '/app/img/blank_tile.png'
            }
          },
          overlays: {
              shapes: {
                  name: 'Shapes',
                  type: 'group',
                  visible: true
              },
              region: {
                  visible: false
              }
          }
        };

        $scope.setLocation = function(location) {
          $scope.region = {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
            type: 'point'
          }
        };

        $scope.setRegion = function(region) {
            var theBounds = leafletBoundsHelpers.createBoundsFromArray([
                [region.extent.coordinates[0][2][1], region.extent.coordinates[0][2][0]],
                [region.extent.coordinates[0][0][1], region.extent.coordinates[0][0][0]]
            ]);
            $scope.region = {
                regionName: region.region_name,
                regionType: region.region_type,
                regionId: region.region_id,
                bounds: theBounds,
                type: 'polygon'
            };
        };

        //$scope.$watch(
        //  'location',
        //  function(location,oldValue) {
        //    if(location.lat !== undefined && location.lng !== undefined) {
        //      $scope.markers = {
        //        list: {
        //          lat: location.lat,
        //          lng: location.lng,
        //          layer: 'shapes'
        //        }
        //      }
        //      $scope.center =  {
        //        lat: location.lat,
        //        lng: location.lng,
        //        zoom: 5
        //      };
        //
        //      $scope.paths.buffer =  {
        //            type: 'circle',
        //            weight: 2,
		 //               color: '#ff612f',
        //            latlngs: {
        //              lat: location.lat,
        //              lng: location.lng
        //            },
        //            radius: 50000,
        //            layer: 'shapes'
        //      };
        //
        //      $scope.layers.overlays.shapes = {
        //          visible: true
        //      };
        //      $scope.layers.overlays.region = {
        //        visible: false
        //      };
        //      $scope.region = {}; // reset the region
        //
        //    }
        //  },true
        //);

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
              'region',
              function(region, oldValue) {

                  console.log("Region watch has been triggered");

                  if (region.region_type !== undefined) {
                      $scope.setRegion(region);
                  }

                  if (region.regionId !== undefined) {
                    // case 1
                      console.log("Region watch case 1 has been triggered");
                      $http({
                          "withCredentials": false,
                          "method": "POST",
                          "url": "https://mol.cartodb.com/api/v1/map/named/display_region",
                          "data": {
                              "regionid": region.regionId
                          }
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
                              $scope.bounds = $scope.region.bounds;
                          }
                      );
                  } else if(region.lat !== undefined && region.lng !== undefined) {
                      // case 2
                      console.log("Region watch case 2 has been triggered");
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
                      console.log("Region watch case 3 has been triggered");
                    } else if (region.regionType !== undefined) {
                      // case 4
                      console.log("Region watch case 4 has been triggered");
                      $http({
                          "withCredentials": false,
                          "method": "POST",
                          "url": "https://mol.cartodb.com/api/v1/map/named/display_region",
                          "data": {
                              "type": region.regionType
                          }
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
                              $scope.bounds = $scope.region.bounds;
                          }
                      );

                  }
              },true
          );

       $scope.$on("leafletDirectiveMap.click", function(event, args){
           var leafEvent = args.leafletEvent;
           $scope.setLocation(leafEvent.latlng);
           $state.transitionTo(
             'location.latlng',
             {lat: Math.round(leafEvent.latlng.lat*1000)/1000,
              lng: Math.round(leafEvent.latlng.lng*1000)/1000}
           );
       });

       if($state.params.lat && $state.params.lng) {
         $scope.setLocation($state.params);
       } else if ($state.params.placename) {

           var placename = $state.params.placename;
           if (placename == parseInt(placename)) {
               MOLApiX('searchregion', {regionid: placename})
                   .then(
                   function (response) {
                       $scope.setRegion(response.data[0]);
                   }
               );
           } else if (placename == 'mountain_region') {
               $scope.region = {
                   regionType: placename
               }
           } else {
              MOLApiX('searchregion', {name: placename})
                  .then(
                  function(response) {
                      $scope.setRegion(response.data[0]);
                  }
              );

             //$http({
             //    url: 'http://nominatim.openstreetmap.org/search',
             //    method: 'GET',
             //    params: {
             //      q: placename.replace(/_/g,''),
             //      format: 'json'
             //    },
             //    withCredentials: false
             //}).then(
             //  function(response) {
             //    try{
             //      var location = {
             //        lat: response.data[0].lat,
             //        lng: response.data[0].lon
             //     };
             //      $scope.setLocation(location);
             //    } catch(e) {}
             //  }
             //);
           }
       }

      }
    };
}]);
