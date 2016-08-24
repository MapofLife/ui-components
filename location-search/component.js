angular.module('mol.location-search',['mol-location-search-templates'])
.directive('molLocationSearch', [
  'molApi','$state','$q','$translate','$rootScope',
  function(molApi,$state,$q,$translate,$rootScope) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-location-search-control.html',
      controller: function($scope,$state) {

        $scope.canceller = $q.defer();

        //get all available region types
        $scope.regionTypes = {
            selected: undefined,
            available:[]};

        $scope.regions = {
            available: [],
            selected: undefined
        }


        $rootScope.$on(
          '$translateChangeSuccess',
          function(e) {
            $scope.selectRegionType($scope.regionTypes.selected);
          }
        )

      molApi({
           "canceller": $scope.canceller,
           "loading": true,
           "service" : "spatial/regions/types",
           "creds" : true,
        }).then(
            function(response) {
              var defaultType = ($state.params.regiontype || 'global').toLowerCase();
              console.log($state.params.regiontype);
              console.log(defaultType);
              $scope.regionTypes.available = [{
                bnds: [
                  -180,-90,180,90
                ],
                name: "Global",
                title: "Global",
                type: "global",
                region_id: "-"
              }]
                .concat(response.data);
              angular.forEach(
                response.data,
                function(type) {
                  try {
                  if(type.type.toLowerCase() === defaultType) {
                      $scope.selectRegionType(type);
                  }} catch(e) {}
                });
            }
        )

        $scope.global = function() {
            $scope.selectRegion({
              bnds: [
                -180,-90,180,90
              ],
              name: "Global",
              title: "Global",
              type: "global"
            });


        }


        $scope.selectRegionType = function(type) {
          if(type&&type.dataset_id) {
            var lang = $translate.use();
            if($scope.regions.available.indexOf($scope.regions.selected)==-1) {
              $scope.regions.selected = undefined;
            };

            $scope.regionTypes.selected = type;
            $scope.$parent.region = type;
            $state.transitionTo(
              $state.current,
              {"regiontype":type.type,"lang":$translate.use()},
              {"notify":false,"inherit":true,"reload":false}
            );
             molApi({
              "service":"spatial/regions/list",
              "params":{"dataset_id" : type.dataset_id, "lang":lang},
              "canceller": $scope.canceller,
              "loading": true
            }).success(function(response) {
              $scope.regions.available = response;/*.filter(
                function(r) {return r.download}
              );*/
              angular.forEach(
                response,
                function(region) {
                  try{
                    if(($scope.regions.selected && region.region_id === $scope.regions.selected.region_id) || (
                      $scope.regions.selected === undefined &&
                        region.name.toLowerCase()===$state.params.region.toLowerCase())){
                      $scope.selectRegion(region);
                    }
                  }catch(e){}
                });
            });
          }
        }

        $scope.selectRegion = function(region){
          $scope.$parent.region = angular.copy(region);
          $scope.regions.selected = angular.copy(region);
          $state.transitionTo(
            $state.current,
            {"region":region.name.toLowerCase()},
            {"notify":false,"inherit":true,"reload":false}
          )
        }

        $scope.$watch(
          'regionTypes.selected',
          function(newValue,oldValue) {
            if(newValue)  {
              $scope.selectRegionType(newValue);
            }
          }
        );
      }
    };
}]);
