angular.module('mol.species-description',['mol-species-description-templates'])
.directive('molSpeciesDescription', [
  'GetWiki',
  function( GetWiki) {

    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname',
      },
      templateUrl: 'mol-species-description-main.html',
      controller: function($scope,$q, $state,$timeout,$cookies) {
        $scope.canceller = $q.defer();
        $scope.description = undefined;
        $scope.$watch(
          'scientificname',
          function(newValue,oldValue) {
            $scope.description = undefined;
            if(newValue == undefined) {
              return;
            }
          GetWiki(newValue).query(
              function(response){
                $scope.description = response.content;
            });
          }
        );
      }
    };
}]).factory(
	'GetWiki',
	[
		'$resource','$q',
		function($resource, $q) {
			return function(name) {
				var abort = $q.defer();
				return $resource(
					'https://api.mol.org/wiki',
					{},
					{
						query: {
							method:'GET',
							params:{
								name: name,
							},
							ignoreLoadingBar: false,
							isArray:false,
							timeout: abort,
							transformResponse : function(data, headersGetter) {
								return JSON.parse(data);
							}

						}
					}
				);
			}
		}
	]
);
