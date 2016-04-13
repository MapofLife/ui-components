angular.module('mol.location-search',['mol-location-search-templates'])
.directive('molLocationSearch', [
  'MOLApi','$state','$q',
  function(MOLApi,$state,$q) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-location-search-control.html',
      controller: function($scope,$state) {

        $scope.canceller = $q.defer();


        //get all available region types
        $scope.regionTypes = {
            selected: null,
            available:[]};

        $scope.regions = {
            available: [],
            selected: null
        }

        MOLApi({
           "canceller": $scope.canceller,
           "loading": true,
           "service" : "spatial/regions/types",
           "version" : "0.x",
           "creds" : true,
        }).then(
            function(response) {
              $scope.regionTypes.available = response.data;
              angular.forEach(
                response.data,
                function(type) {
                  try {
                  if(type.name.toLowerCase()===$state.params.regiontype.toLowerCase()){
                    $scope.regionTypes.selected = type.id;
                  }} catch(e) {}
                });
            }
          );

        $scope.selectRegionType = function(type_id) {
           MOLApi({
            "service":"spatial/regions/regions",
            "params":{"id" : type_id},
            "canceller": $scope.canceller,
            "loading": true
          }).success(function(response) {
            $scope.regions.available = response;
            angular.forEach(
              response,
              function(region) {
                try{if(region.name.toLowerCase()===$state.params.region.toLowerCase()){
                  $scope.selectRegion(region);
                }}catch(e){}
              });
          });
        }

        $scope.selectRegion = function(region){
          $scope.$parent.region = region;
          $scope.regions.selected = region;
          $state.transitionTo(
            $state.current,
            {"region":region.name},
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
