angular.module('mol.location-search',['mol-location-search-templates'])
.directive('molLocationSearch', [
  'molApi','$state','$q',
  function(molApi,$state,$q) {
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

      /*  molApi({
           "canceller": $scope.canceller,
           "loading": true,
           "service" : "spatial/regions/types",
           "creds" : true,
        }).then(
            function(response) {
              $scope.regionTypes.available = response.data;
              angular.forEach(
                response.data,
                function(type) {
                  try {
                  if(type.type.toLowerCase()==='countries' ){//$state.params.regiontype.toLowerCase()*{
                    $scope.regionTypes.selected = type;
                  }} catch(e) {}
                });
            }
          );*/

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
            $state.transitionTo(
              $state.current,
              {"regiontype":type.type},
              {"notify":false,"inherit":true,"reload":false}
            );
             molApi({
              "service":"spatial/regions/list",
              "params":{"dataset_id" : type.dataset_id},
              "canceller": $scope.canceller,
              "loading": true
            }).success(function(response) {
              $scope.regions.available = response;
              angular.forEach(
                response,
                function(region) {
                  try{
                    if(region.name.toLowerCase()===$state.params.region.toLowerCase()){
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
