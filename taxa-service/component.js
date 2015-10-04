'use strict';

angular.module('mol.species-list-service',[])
//Service to manage a species list selected by location.
.service("MOLSpeciesList",[
   'MOLApi','MOLApiX','$http', '$state',
   function(MOLApi,MOLApiX,$http,$state) {

			this.searchRegion = function(region) {
          var defaults = {"lang":"en","radius":50000},
              remove = {"bounds":true,"extent":true},
              config = angular.copy(region);
              angular.forEach(
                config,
                function(value,key) {if(remove[key]) {delete config[key]}});
					return (region.lat && region.lng) ?
							  MOLApiX('specieslist',angular.extend(config,defaults)) :
				        MOLApiX('specieslist',config);
			}


}]);
