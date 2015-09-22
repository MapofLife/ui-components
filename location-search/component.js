angular.module('mol.location-search',['mol-species-search-templates'])
.directive('speciesSearch', [
  'MOLServices','$state','$q',
  function(MOLServices,$state,$q) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-location-search-control.html',
      controller: function($scope) {

        $scope.canceller = $q.defer();
        //search for a new species in the search bar
        $scope.searchSpecies = function(term) {
          //$scope.canceller.resolve();
          return MOLServices(
            'searchspecies',
            {
              "term": term,
              "group": $scope.groups.selected.value
            },
            $scope.canceller,
            true
          ).then(
            function(results) {
              return results.data;
            }
          );
        };

        //get all available taxa
        $scope.groups = {
            selected: {},
            available:[]};

        MOLServices(
            'availabletaxa',{}, $scope.canceller, false
          ).then(
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
          //$scope.canceller.resolve();
           MOLServices(
            'speciesinfo',
            {"name" : scientificname},
            $scope.canceller, true
          ).success(function(species) {

              if(species == undefined) return;
              if(species.prefs != undefined) {
                if(species.prefs.habitats != undefined) {
                  var bools = [];
                    for(var i=0;i<17;i++) {bools.push(false);}

                    species.prefs.habitats.split(',').forEach(
                        function(h) {bools[parseInt(h)]=true}
                    );

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
        };
        $scope.randomSpecies = function() {

          var mode = 'randomspecies';

          $scope.selected = undefined;
          $scope.selected = MOLServices(
            mode,
            {
             "group" : $scope.groups.selected.value,
             "rand": Math.random()},
             true
          ).success(
            function(species) {
              $scope.selectSpecies(species.n);
          });
        };

        $scope.$watch(
          'species',
          function(newValue,oldValue) {
            if(newValue)  {
              var taxa = newValue.taxa||'Any group';
              $scope.groups.selected = {
                label: taxa,
                value: taxa
              };
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
