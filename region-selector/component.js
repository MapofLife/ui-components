angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', [
            '$modal', '$http', '$cookies', 'MOLApiX',
    function($modal,   $http,   $cookies,   MOLApiX) {
        return {
            restrict: 'A',
            scope: { location: '@location' },
            controller: function($scope) {
                MOLApiX('searchregion').then(function(results) {
                    // TODO: Waiting on the new API call here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    $scope.regionTypes = [{region_type: 'mountain_region', region_type_name: 'Mountain Region'}];
                    //angular.forEach(results.data, function(regionType) {
                        // $scope.regionTypes.push({
                        //     region_type: regionType.region_type,
                        //     region_type_name: regionType.region_type
                        //                                 .replace('_', ' ')
                        //                                 .replace(/\w\S*/g, function(str) {
                        //                                     return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
                        //                                 })
                        // });
                    //});
                });
            },
            link: function(scope, element, attrs, ctrl) {
                element.bind('click', function() {
                    var modal = $modal.open({
                        animmation: true,
                        templateUrl: 'mol-region-selector.html',
                        controller: function($scope) {
                            $scope.regionTypes = {
                                selected:  {},
                                available: scope.regionTypes
                            };
                            $scope.regions = {
                                selected:  {},
                                available: []
                            };
                            $scope.regionSelectionComplete = function() {
                                $scope.location = $scope.regions.selected;
                                modal.close();
                            };
                            $scope.regionTypeSelected = function() {
                                $scope.regions = {
                                    selected:  {},
                                    available: []
                                };
                                MOLApiX('searchregion',
                                        {type: $scope.regionTypes.selected.region_type}
                                ).then(function(results) {
                                     $scope.regions.available = results.data;
                                });
                            };
                        }
                    });
                });
            }
        };
    }]);
