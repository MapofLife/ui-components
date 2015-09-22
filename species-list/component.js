angular.module('mol.species-list',['mol-species-list-templates'])
  .directive('molSpeciesList', [
    function() {
    return {
      restrict: 'E',
      scope: {
        taxon: '=taxon',
        species: '=species'
      },
      templateUrl: 'mol-species-list-main.html',
      controller: function($scope) {
        $scope.$watch('taxon',
          function(newValue,oldValue) {
            $scope.species = undefined;
          },true)
        $scope.selectSpecies = function(species) {
          $scope.selected = species.scientificname;
          $scope.species = species;
        }
      }
    };
}]);
