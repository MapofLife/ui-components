angular.module('mol.species-search',['mol-species-search-templates'])
.directive('molSpeciesSearch',
  function() {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-species-search-control.html',
      controller: ['$scope','molApi','$state','$q','$translate','$rootScope',
       function($scope, molApi,$state,$q,$translate,$rootScope) {

        var regionid = undefined;
        try{
          regionid = $scope.$parent.region.dataset_id
        } catch(e) {};

        if(!$scope.groups||!$scope.groups.selected) {

          $scope.groups = {selected:'Select a group', available:[]};
        }
        $rootScope.$on(
            '$translateChangeSuccess',function(e) {
              var lang = $translate.use();
              $scope.updateTaxa($scope.region.region_id);
              $scope.species.common =
                $scope.species.taxonomy[lang+'_name'] ||
                $scope.species.taxonomy.en_name;
            }
        );
        $scope.canceller = $q.defer();

        $rootScope.$on(
            '$stateChangeSuccess',function(e) {
              if($state.params.scientificname && $scope.species &&
                 $state.params.scientificname.replace('_',' ').toLowerCase()
                    !==$scope.species.scientificname.toLowerCase()) {
                       $scope.selectSpecies($state.params.scientificname.replace('_',' '));
              }
            }
        );
        $scope.canceller = $q.defer();
        //search for a new species in the search bar
        $scope.searchSpecies = function(term) {
          //$scope.canceller.resolve();

          return molApi({
            "service":"species/groupsearch",
            "params" : {
              "query": term,
              "group": ($scope.groups.selected !== 'any') ? $scope.groups.selected : undefined,
              "regionid": ($scope.region)?$scope.region.region_id : undefined,
              "lang": $translate.use()
            },
            "canceller": $scope.canceller,
            "loading": true
          }).then(
            function(results) {
              return results.data;
            }
          );
        };

        //get all available taxa
        $scope.groups = {
            available:[]};

        $scope.updateTaxa = function(region_id) {
        molApi({
           "canceller": $scope.canceller,
           "loading": true,
           "service" : (region_id) ? "spatial/regions/species2" : "species/availabletaxa",
           "params" : {
             "region_id":region_id,
             "lang":$translate.use()
           },
           "creds" : true,
        }).then(

            function(results) {
              var groups = [];
              angular.forEach(
                results.data,
                function(result) {
                  groups.push(
                    angular.copy(angular.extend(result,
                    {label: result.title,
                     value: result.taxa}))
                  )
                }
              );
              $scope.groups.available = groups;
              $scope.$parent.groups = groups;
            }
          );
        }




        $scope.selectSpecies = function(scientificname) {
         if(scientificname==='') {
           $scope.randomSpecies();
         } else {
           
              $scope.$parent.species = {scientificname: scientificname};
            }
          
        };


        $scope.randomSpecies = function() {
          var group = null;
          try {group = $scope.groups.selected}
          catch(e) {}

          molApi({
            "service": "species/random",
            "params": {
             "taxogroup" : (group !== 'any') ? group: undefined,
             "region_id":$scope.region.region_id,
             "lang": $translate.use(),
             "rand": Math.random()*1000000
           },
           "canceller": $scope.canceller,
           "loading": true
          }).success(
            function(species) {
              //$scope.groups.selected = species.taxa;
              $scope.selectSpecies(species.scientificname);
          });
        };

        $scope.$watch(
          'species',
          function(newValue,oldValue) {
            if(newValue)  {
              var taxa = newValue.taxa||'Any group';
              $scope.groups.selected = taxa;
            }
          }
        );

        $scope.$watch(
          'region.region_id',
          function(newValue,oldValue) {
            if(newValue)  {
              $scope.updateTaxa(newValue);
            }
          },true
        );
        $scope.updateTaxa();

        if($state.params.scientificname) {
          $scope.selectSpecies($state.params.scientificname.replace(/_/g, ' '));
        } else {
          // $scope.randomSpecies();
        };


      }]
    };
});
