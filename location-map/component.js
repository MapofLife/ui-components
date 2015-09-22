angular.module('mol.location-map',['mol-location-map-templates'])
  .directive('molLocationMap', [
    '$state','$http','leafletData',
    function($state,$http, leafletData) {

    return {
      restrict: 'AE',
      scope: {
        location: '=location',
        width: '=width',
        height: '=height'
      },
      templateUrl: 'mol-location-map-main.html',
      link: function(scope, element, attr, leafletData  ) {


      },
      controller: function($scope,$state, $http, $element, leafletData) {

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
        $scope.location = {};
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
              }
          }
        };


        $scope.setLocation = function(location) {
          $scope.location = {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
            type: 'point'
          }
        }

        $scope.$watch(
          'location',
          function(location,oldValue) {
            if(location.lat !== undefined && location.lng !== undefined) {
              $scope.markers = {
                list: {
                  lat: location.lat,
                  lng: location.lng,
                  layer: 'shapes'
                }
              }
              $scope.center =  {
                lat: location.lat,
                lng: location.lng,
                zoom: 5
              };

              $scope.paths.buffer =  {
                    type: 'circle',
                    weight: 2,
		                color: '#ff612f',
                    latlngs: {
                      lat: location.lat,
                      lng: location.lng
                    },
                    radius: 50000,
                    layer: 'shapes'
              };
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
         $http({
             url: 'http://nominatim.openstreetmap.org/search',
             method: 'GET',
             params: {
               q: $state.params.placename.replace(/_/g,''),
               format: 'json'
             },
             withCredentials: false
         }).then(
           function(response) {
             try{
               var location = {
                 lat: response.data[0].lat,
                 lng: response.data[0].lon
              };
               $scope.setLocation(location);
             } catch(e) {}
           }
         );
       }

      }
    };
}]);
