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
           molApi({
            "service":"species/habitat",
            "params":{
              "id" : scientificname,
              "lang" : $translate.use()
            },
            "canceller": $scope.canceller,
            "loading": true
            }).success(function(species) {

              if(species == undefined) return;
              if(species.prefs != undefined) {
                if(species.prefs.habitats != undefined) {
                  var bools = [];
                    for(var i=0;i<17;i++) {bools.push(false);}
                    try {
                    species.prefs.habitats.split(',').forEach(
                        function(h) {bools[parseInt(h)]=true}
                    );
                  } catch(e) {}
                    species.prefs.habitats = bools;
                    if(species.prefs.tree_cover_min==100) {
                      species.prefs.tree_cover_min=50;
                    }
                }
              }

              species.refine = {};
              species.protect = {};
              species.maps = {};
              species.updateMaps = true;
              species.habitat = {
                "stats": {
                  "forest_b1": undefined,
                  "forest_b0": undefined,
                  "pop_se_b1": undefined,
                  "area_se_b1": undefined,
                  "area_conf_95_10": [undefined, undefined],
                  "pop_b0": undefined,
                  "pop_conf_95_10": [undefined, undefined],
                  "area_b1": undefined,
                  "area_b0": undefined,
                  "forest_se_b1": undefined,
                  "forest_percent_change": undefined,
                  "pop_percent_change": undefined,
                  "area_percent_change": undefined,
                  "forest_conf_95_10": [undefined, undefined],
                  "pop_b1": undefined
                },
                "area": [
                  [2012, 0],
                  [2003, 0],
                  [2011, 0],
                  [2001, 0],
                  [2002, 0],
                  [2010, 0],
                  [2004, 0],
                  [2005, 0],
                  [2006, 0],
                  [2007, 0],
                  [2008, 0],
                  [2009, 0]
                ],
                "forest": [
                  [2012, 0],
                  [2003, 0],
                  [2011, 0],
                  [2001, 0],
                  [2002, 0],
                  [2010, 0],
                  [2004, 0],
                  [2005, 0],
                  [2006, 0],
                  [2007, 0],
                  [2008, 0],
                  [2009, 0]
                ],
                "pop": [
                  [2012, 0],
                  [2003, 0],
                  [2011, 0],
                  [2001, 0],
                  [2002, 0],
                  [2010, 0],
                  [2004, 0],
                  [2005, 0],
                  [2006, 0],
                  [2007, 0],
                  [2008, 0],
                  [2009, 0]
                ]
              };
              $scope.$parent.species = species;

            });
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
