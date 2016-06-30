angular.module('mol.species-description',['mol-species-description-templates'])
.directive('molSpeciesDescription',
  function() {
    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname'
      },
      transclude: false,
      templateUrl: 'mol-species-description-main.html',
      controller: ['$scope','molApi','$translate','$rootScope','$q','$filter',
        function($scope,molApi,$translate,$rootScope,$q, $filter) {
        $scope.model=undefined;
        $scope.canceller = $q.defer();
        $scope.getDesc = function() {
          var lang = $translate.use();
          $scope.model=undefined;
          $scope.canceller.resolve();
          $scope.canceller = $q.defer();
          molApi({
            "service" : "species/info",
            "params": {
              "scientificname" :$scope.scientificname,
              "lang" : lang
            },
            "canceller":$scope.canceller
          }).then(
            function(response) {
              $scope.model = response.data[0].info.filter(function(i){return i.lang === lang})[0]
                 || response.data[0].info[0];
            }
          );
        }
        $rootScope.$on('$translateChangeSuccess',function(e) {$scope.getDesc();});
        $scope.$watch("scientificname",function(n,o) {if(n){$scope.getDesc()}});
        $scope.getDesc();
      }]
    };
});
