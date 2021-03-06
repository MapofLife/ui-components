angular.module('mol.species-list',['mol-species-list-templates'])
  .directive('molSpeciesList', [
    function() {
    return {
      restrict: 'E',
      scope: {
        taxon: '=', species: '=', filterBy: '='
      },
      templateUrl: 'mol-species-list-main.html',
      controller: function($scope) {
        $scope.$watch(
          'taxon', function(newValue, oldValue) {
              var notPresent = true;
              angular.forEach(
                newValue,
                function(species) {
                    if(species.scientificname === $scope.scientificname) {
                      notPresent = false;
                    }
                }
              );
              if(notPresent) {$scope.species = undefined}
          }
        );
        $scope.selectSpecies = function(species) {
          $scope.selected = species.scientificname;
          $scope.species = species;
        }
      }
    };
}]);
