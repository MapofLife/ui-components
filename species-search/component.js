angular.module('mol.species-search',['mol-species-search-templates'])
.directive('molSpeciesSearch', [
  'MOLApi','$state','$q',
  function(MOLApi,$state,$q) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-species-search-control.html',
      controller: function($scope) {

        $scope.canceller = $q.defer();
        //search for a new species in the search bar
        $scope.searchSpecies = function(term) {
          //$scope.canceller.resolve();
          var regionid = undefined;
          try{ regionid = $scope.$parent.region.id} catch(e) {}
          return MOLApi({
            "service":"species/groupsearch",
            "params" : {
              "query": term,
              "group": $scope.groups.selected,
              "regionid": regionid
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
            selected: null,
            available:[]};

        MOLApi({
           "canceller": $scope.canceller,
           "loading": true,
           "service" : "system/availabletaxa",
           "version" : "0.x",
           "creds" : true,
        }).then(
            function(results) {
              angular.forEach(
                results.data,
                function(result) {
                  $scope.groups.available.push(
                    {label: result.taxa, value: result.taxa}
                  )
                }
              )
            }
          );



        $scope.selectSpecies = function(scientificname) {
         if(scientificname==='') {
           $scope.randomSpecies();
         } else {
           MOLApi({
            "service":"species/habitat",
            "params":{"id" : scientificname},
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
          try {group = $scope.groups.selected.value}
          catch(e) {}

          MOLApi({
            "service": "species/random",
            "params": {
             "taxogroup" : group,
           },
           "canceller": $scope.canceller,
           "loading": true
          }).success(
            function(species) {
              $scope.groups.selected = species.taxa;
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

        if($state.params.scientificname) {
          $scope.selectSpecies($state.params.scientificname.replace(/_/g, ' '));
        } else {
          $scope.randomSpecies();
        };


      }
    };
}]);
