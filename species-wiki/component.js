angular.module('mol.species-wiki',['mol-species-wiki-templates'])
.directive('molSpeciesWiki', [
  'MOLApi','molApiVersion',
  function(MOLApi,molApiVersion) {
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
            MOLApi({
              "service" : "wiki",
              "version" : molApiVersion,
              "params": {"scientificname" : newValue}
            }).then(
              function(response) {
                $scope.wiki = response.data;
              }
            );
          });
      }
    };
}]);
