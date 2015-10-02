angular.module('mol.taxa-counts',['mol-taxa-counts-templates'])
  .directive('molTaxaCounts', ['$filter',
    function($filter) {
    return {
      restrict: 'E',
      scope: {
        taxon: '=',taxa: '=',lang: '=',
        filterBy: '='
      },
      templateUrl: 'mol-taxa-counts-main.html',
      controller: function($scope,$filter) {
        $scope.taxa = undefined;
        $scope.selectTaxon = function(taxon) {
          $scope.taxon = taxon;
        }
      }
    };
}]);
