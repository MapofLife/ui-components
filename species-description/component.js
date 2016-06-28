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
      controller: ['$scope','molApi','molApiVersion','$translate','$rootScope','$q',
        function($scope,molApi,molApiVersion,$translate,$rootScope,$q) {
        $scope.model=undefined;
        $scope.canceller = $q.defer();
        $scope.getDesc = function() {
          $scope.model=undefined;
          $scope.canceller.resolve();
          $scope.canceller = $q.defer();
          molApi({
            "service" : "species/info",
            "version" : molApiVersion,
            "params": {
              "scientificname" :$scope.scientificname,
              "lang" : $translate.use()
            },
            "canceller":$scope.canceller
          }).then(
            function(response) {
              $scope.model = response.data[0].info[0];
            }
          );
        }
        $rootScope.$on('$translateChangeSuccess',function(e) {$scope.getDesc();});
        $scope.$watch("scientificname",function(n,o) {if(n){$scope.getDesc()}});
        $scope.getDesc();
      }]
    };
});
