angular.module('mol.species-detail',['mol-species-detail-templates'])
  .directive('molSpeciesDetail', [
    function() {
    return {
      restrict: 'E',
      scope: {
        species: '=species'
      },
      templateUrl: 'mol-species-detail-main.html'
    };
}]);
