angular.module('mol.species-description',['mol-species-description-templates'])
.directive('molSpeciesDescription',
  function() {
    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname',
        spinfo: '=spinfo'
      },
      transclude: false,
      templateUrl: 'mol-species-description-main.html',
      controller: ['$scope','molApi','$translate','$rootScope','$q','$filter',
        function($scope,molApi,$translate,$rootScope,$q, $filter) {
        $scope.contentMode = 0;
        $scope.model=undefined;
        $scope.canceller = $q.defer();
        // $scope.getDesc = function() {
        //   if ($scope.spinfo && $scope.spinfo.commonname) {
        //     $scope.model = $scope.spinfo;
        //   } else if($scope.scientificname) {
        //     var lang = $translate.use();
        //     $scope.model=undefined;
        //     if ($scope.canceller) {
        //       $scope.canceller.resolve();
        //       $scope.canceller = undefined;
        //     }
        //     $scope.canceller = $q.defer();
        //     molApi({
        //       "service" : "species/info",
        //       "params": {
        //         "scientificname" :$scope.scientificname,
        //         "lang" : lang
        //       },
        //       "canceller":$scope.canceller
        //     }).then(
        //       function(response) {
        //         $scope.model = (response.data[0].info) ? response.data[0].info.filter(function(i){return i.lang === lang})[0]
        //            || response.data[0].info[0]: {};
        //       }
        //     ).finally(function () {
        //       // unset the canceller the subsequent requests work
        //       // TODO: Make sure this is the proper way to do it.
        //       $scope.canceller = undefined;
        //     });
        //   }
        // }

        $scope.getDesc = function() {
          $scope.contentMode = 1;
          if ($scope.$parent.species && $scope.$parent.species.info) {
            $scope.model = $scope.$parent.species.info[0];
            $scope.contentMode = 0;
          } else if ($scope.$parent.species) {
            $scope.contentMode = 2;
          }
        }
        $rootScope.$on('$translateChangeSuccess',function(e) {$scope.getDesc();});
        $scope.$watch("scientificname",function(n,o) {if(n){$scope.getDesc()}});
        $scope.getDesc();
      }]
    };
});
