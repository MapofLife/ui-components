'use strict';

angular.module('mol.species-list-service',[])
//Service to manage a species list selected by location.
.service("MOLSpeciesList",[
   'MOLApi','MOLApiX','$http', '$state',
   function(MOLApi,MOLApiX,$http,$state) {

			this.searchRegion = function(region) {
<<<<<<< HEAD
          var config = angular.copy(region),
              defaults = {"lang":"en","radius":50000},
              remove = {"extent":true,"bounds":true};
          angular.forEach(config,function(value,key){
            if(remove[key]){delete config[key]}
          });
					return MOLApiX('specieslist',angular.extend(config,defaults));
=======
          var defaults = {"lang":"en","radius":50000},
              remove = {"bounds":true,"extent":true},
              config = angular.copy(region);
              angular.forEach(
                config,
                function(value,key) {if(remove[key]) {delete config[key]}});
					return (region.lat && region.lng) ?
							  MOLApiX('specieslist',angular.extend(config,defaults)) :
				        MOLApiX('specieslist',config);
>>>>>>> eacb0e61207f11beef58e575fe3d82c4aedb8a33
			}


}]);
