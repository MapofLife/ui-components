'use strict';

angular.module('mol.species-list-service',[])
//Service to manage a species list selected by location.
.service("MOLSpeciesList",[
   'MOLApi','MOLApiX','$http', '$state',
   function(MOLApi,MOLApiX,$http,$state) {

			this.searchRegion = function(region) {
          var config = angular.copy(region),
              defaults = {"lang":"en","radius":50000},
              remove = {"extent":true,"bounds":true};
          angular.forEach(config,function(value,key){
            if(remove[key]){delete config[key]}
          });
					return MOLApiX('specieslist',angular.extend(config,defaults));
			}


}]);
