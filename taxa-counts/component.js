angular.module('mol.taxa-counts',['mol-taxa-counts-templates'])
  .directive('molTaxaCounts', [
    'MOLApi','$state',
    function(MOLApi,$state) {

    return {
      restrict: 'E',
      scope: {
        taxon: '=taxon',
        location: '=location',
        lang: '=lang'
      },
      templateUrl: 'mol-taxa-counts-main.html',
      controller: function($scope,MOLApi) {

        if($state.params.taxa) {
          $scope.selected = $state.params.taxa;
        }
        $scope.selectTaxon = function(taxon) {
          var
            params = $state.params,
            state = $state.current.name;

          if(state=='location') {
            state = 'location.latlng';
            params.lat = $scope.location.lat;
            params.lng = $scope.location.lng;
          }
          $scope.taxon = taxon;
          $scope.selected = taxon.taxa;
          params.taxa = taxon.taxa;

          $state.transitionTo(state,params);
        }

        $scope.$watch(
          'location',
          function(newValue,oldValue) {
              $scope.taxa = undefined
              $scope.taxon = undefined
              MOLApi(
                'specieslist',
                {lat: $scope.location.lat,
                 lng: $scope.location.lng,
                 radius: 50000,
                 lang: 'en'
               }).then(
                 function(result) {
                   $scope.taxa = result.data;
                   if($scope.selected) {
                     angular.forEach(
                       $scope.taxa,
                       function(taxon) {
                         if (taxon.taxa === $scope.selected) {
                           $scope.taxon = taxon;
                         }
                       }
                    );
                   }
                 }
               );
          },
          true
        );
      }
    };
}]);
