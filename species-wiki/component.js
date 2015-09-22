angular.module('mol.species-wiki',['mol-species-wiki-templates'])
.directive('molSpeciesWiki', [
  'GetWiki','$state','$q',
  function(GetWiki,$state,$q) {
    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname'
      },
      transclude: false,
      templateUrl: 'mol-species-wiki-main.html',
      controller: function($scope) {
        $scope.$watch(
          "scientificname",
          function(newValue,oldValue) {
            GetWiki(newValue).query(
              function(wiki) {
                $scope.wiki = wiki;
              }
            );
          });
      }
    };
}]);
