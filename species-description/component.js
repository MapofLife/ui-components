angular.module('mol.species-description',['mol-species-description-templates'])
.directive('molSpeciesDescription', [
  'molApi','molApiVersion',
  function(molApi,molApiVersion) {
    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname'
      },
      transclude: false,
      templateUrl: 'mol-species-description-main.html',
      controller: function($scope,molApi,molApiVersion) {
        $scope.$watch(
          "scientificname",
          function(newValue,oldValue) {
            if(newValue) {
              molApi({
                "service" : "species/wiki",
                "version" : molApiVersion,
                "params": {
                  "name" : newValue,
                  "lang" : "en"
                }
              }).then(
                function(response) {
                  $scope.model = response.data;
                }
              );
            }
          });
      }
    };
}]);
