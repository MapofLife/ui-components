angular.module('mol.location-search',['mol-location-search-templates'])
.factory('molRegionTypes', [
  function () {
    return [{"dataset_id": "3fc08de0-49e9-479d-95f4-42b2ad82f3bf", "citation": "IUCN and UNEP-WCMC (2016), The World Database on Protected Areas (WDPA), February 2016, Cambridge, UK: UNEP-WCMC. Available at: www.protectedplanet.net.", "type": "national_parks", "dataset_title": "National Parks", "title": "National Parks"}, {"dataset_id": "e9707baa-46e2-4ec4-99b6-86b1712e02de", "citation": "Global Administrative Areas. (2016). GADM database of Global Administrative Areas, version 2.8. http://www.gadm.org.", "type": "countries", "dataset_title": "Global Administrative Areas v 2.8", "title": "Political boundaries"}, {"dataset_id": "b9a90786-1ee6-4a69-a3fe-686ec6f8ad68", "citation": "Global Administrative Areas. (2016). GADM database of Global Administrative Areas, version 2.8. http://www.gadm.org.", "type": "kenya_counties", "dataset_title": "Counties of Kenya", "title": "Counties of Kenya"}, {"dataset_id": "b7cc3596-5fce-4546-b583-b482520fc01f", "citation": "K\u00f6rner C., Jetz W., Paulsen J., Payne D., Rudmann-Maurer K., Spehn E. M. (2016). A global inventory of mountains for bio-geographical applications. Alpine Botany. doi:10.1007/s00035-016-0182-6", "type": "mountains", "dataset_title": "GMBA Mountain Ranges", "title": "Mountain Ranges"}];
  }])
.directive('molLocationSearch', [
  'molApi', '$state', '$q', '$translate', '$rootScope', 'molRegionTypes',
  function (molApi, $state, $q, $translate, $rootScope, molRegionTypes) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      //template: 'mol-location-search-control.html',
      controller: function($scope,$state) {

        $scope.canceller = $q.defer();

        //get all available region types
        $scope.regionTypes = {
            selected: undefined,
            available:[]};

        $scope.regions = {
            available: [],
            selected: undefined
        }


        $rootScope.$on(
          '$translateChangeSuccess',
          function(e) {
            $scope.selectRegionType($scope.regionTypes.selected);
          }
        )


        $scope.global = function() {
            $scope.selectRegion({
              bnds: [
                -180,-90,180,90
              ],
              name: "",
              type: "global"
            });


        }


        $scope.selectRegionType = function(type) {
          if(type&&type.dataset_id) {
            var lang = $translate.use();
            $scope.regionTypes.selected = type;
            $state.transitionTo(
              $state.current,
              {"regiontype":type.type,"lang":$translate.use()},
              {"notify":false,"inherit":true,"reload":false}
            );
             molApi({
              "service":"spatial/regions/list",
              "params":{"dataset_id" : type.dataset_id, "lang":lang},
              "canceller": $scope.canceller,
              "loading": true
            }).success(function(response) {
              $scope.regions.available = response.filter(
                function(r) {return r.download}
              );
              angular.forEach(
                response,
                function(region) {
                  try{
                    if(($scope.regions.selected && region.region_id === $scope.regions.selected.region_id) || (
                      $scope.regions.selected === undefined &&
                        region.name.toLowerCase()===$state.params.region.toLowerCase())){
                      $scope.selectRegion(region);
                    }
                  }catch(e){}
                });
            });
          }
        }

        $scope.selectRegion = function(region){
          $scope.$parent.region = angular.copy(region);
          $scope.regions.selected = angular.copy(region);
          $state.transitionTo(
            $state.current,
            {"region":region.name.toLowerCase()},
            {"notify":false,"inherit":true,"reload":false}
          )
        }

        $scope.$watch(
          'regionTypes.selected',
          function(newValue,oldValue) {
            if(newValue)  {
              $scope.selectRegionType(newValue);
            }
          }
        );


        var defaultType = ($state.params.regiontype || undefined);
        if ($state.params.region && !defaultType) {
          defaultType = 'countries';
        } 
        var rtype = molRegionTypes.find(function (type) {
          return type.type.toLowerCase() === defaultType
        }) || undefined;

        $scope.selectRegionType(rtype);

      }
    };
}]);
