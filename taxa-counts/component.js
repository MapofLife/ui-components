angular.module('mol.taxa-counts',['mol-taxa-counts-templates'])
  .directive('molTaxaCounts', [
    function() {
    return {
      restrict: 'E',
      scope: {
        taxon: '=taxon',
        taxa: '=taxa',
        lang: '=lang'
      },
      templateUrl: 'mol-taxa-counts-main.html',
      controller: function($scope) {
        $scope.taxa = undefined;
        $scope.selectTaxon = function(taxon) {
          $scope.taxon = taxon;
        }
      }
    };
}]);
