angular.module('mol.consensus-map',['mol-consensus-map-templates'])
  .directive('molConsensusMap', ['$http','leafletBoundsHelpers',
    function($http,leafletBoundsHelpers) {
      return {
        restrict: 'E',
        scope: {
          scientificname: '=scientificname',
          width: '=width',
          height: '=height',
          extent: '=extent'
        },
        templateUrl: 'mol-consensus-map-main.html',
        controller: function($scope,$http,leafletBoundsHelpers) {
          $scope.defaults = {
            scrollWheelZoom: false
          };
          $scope.center = {lat: 0,lng: 0, zoom: 2};

          $scope.layers = {
            baselayers: {
              positron: {
                name: 'Positron',
                type: 'xyz',
                url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                layerOptions: {
                  subdomains: ['a', 'b', 'c'],
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                  continuousWorld: false
                },
                errorTileUrl: 'https://cdn.mol.org/static/images/blank_tile.png'
              }
            },
            overlays: {}
          };

          $scope.$watch(
            'extent',
            function(newValue, oldValue) {
              console.log(newValue);
            }
          );

          $scope.$watch(
            'scientificname',
            function(newValue,oldValue) {
              if(newValue) {
                $http({
                  "withCredentials": false,
                  "method": "POST",
                  "url": "https://mol.cartodb.com/api/v1/map/named/consensus_map",
                  "data": {
                     "scientificname": newValue
                  }
                }).then(
                 function(result, status, headers, config) {
                   $scope.layers.overlays.consensus = {
                      type: "xyz",
                      url: "https://{0}/mol/api/map/{1}/{z}/{x}/{y}.png"
                        .format(result.data.cdn_url.https,result.data.layergroupid),
                      layerOptions: {
                        attribution: '©2014 Map of Life',
                        continuousWorld: false
                      },
                      name: 'consensus',
                      opacity: 0.8,
                      refresh: true,
                      errorTileUrl: 'https://cdn.mol.org/static/images/blank_tile.png'
                    }
                  }
                );
              }
            }
          );
        }
      };
    }
  ]);
