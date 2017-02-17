angular.module('mol.location-search',['mol-location-search-templates'])
.directive('molLocationSearch', [
  'molApi','$state','$q','$translate','$rootScope',
  function(molApi,$state,$q,$translate,$rootScope) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      //template: 'mol-location-search-control.html',
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


        $scope.global = function() {
            $scope.selectRegion({
              bnds: [
                -180,-90,180,90
              ],
              name: "",
              type: "global"
            });


        }


        $scope.selectRegionType = function(type) {
          if(type&&type.dataset_id) {
            var lang = $translate.use();
            $scope.regionTypes.selected = type;
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
              $scope.regions.available = response.filter(
                function(r) {return r.download}
              );
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

        $scope.selectRegionType({
          "type":"countries",
          "dataset_id":"e9707baa-46e2-4ec4-99b6-86b1712e02de"}

        )

      }
    };
}]);
