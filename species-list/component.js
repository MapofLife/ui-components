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

        $scope.selectSpecies = function(species) {
          $scope.selected = species.scientificname;
          $scope.species = species;
        }
      }
    };
}]);
