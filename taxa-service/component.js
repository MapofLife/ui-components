'use strict';

angular.module('mol.species-list-service',[])
//Service to manage a species list selected by location.
.service("MOLSpeciesList",[
   'MOLApi','MOLApiX','$http', '$state',
   function(MOLApi,MOLApiX,$http,$state) {

			this.searchRegion = function(region) {
          var defaults = {"lang":"en","radius":50000};
					return (region.lat && region.lng) ?
							  MOLApi('specieslist',angular.extend(region,defaults)) :
				        MOLApiX('specieslist',region);
			}
      

}]);
