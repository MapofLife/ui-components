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
<<<<<<< HEAD
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
=======
        $scope.$watch('taxon', function(newValue, oldValue) {
          var notPresent = true;
          angular.forEach(
            newValue.species,
            function(species) {
              if(species.scientificname === $scope.species.scientificname) {
                notPresent = false;
              }
            }
          );
          if(notPresent) {$scope.species = false;}
        })

>>>>>>> eacb0e61207f11beef58e575fe3d82c4aedb8a33
        $scope.selectSpecies = function(species) {
          $scope.selected = species.scientificname;
          $scope.species = species;
        }
      }
    };
}]);
