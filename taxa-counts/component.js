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

        $scope.groupList = undefined;
        $scope.$watch(
          function($scope){
            return [$scope.taxa,$scope.filterBy];
          },
          function(newValues, oldValues) {
              $scope.groupList = $filter('taxa')(
                angular.copy(newValues[0]), newValues[1]);
              if($scope.taxon) {
                angular.forEach(
                  $scope.groupList,
                  function(group) {
                    if(group.taxa === $scope.taxon.taxa) {
                      $scope.selectTaxon(group);
                    }
                  }
                )
              }
            },true
        );

        $scope.selectTaxon = function(taxon) {
          $scope.selected = taxon.taxa
          $scope.taxon = taxon;
        }
      }
    };
}]);
