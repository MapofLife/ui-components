angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', ['$modal', 'MOLApiX', function($modal, MOLApiX) {
        return {
            restrict: 'A',
            scope: {
                region: '=region',
                width: '=width',
                height: '=height'
            },
            controller: function($scope) {
                //MOLApiX('regiontypes').then(function(results) {
                    //$scope.regionTypes = results.data;
                    $scope.regionTypes = [{region_type: 'mountain_region', region_type_name: 'Mountain Region'}];
                //});
            },
            link: function(scope, element, attrs, ctrl) {
                element.bind('click', function() {
                    var modal = $modal.open({
                        animmation: true,
                        templateUrl: 'mol-region-selector.html',
                        controller: function($scope) {
                            $scope.regionTypes = scope.regionTypes;

                            $scope.regionSelectionComplete = function() {
                                if ($scope.regionRecord) {
                                    scope.region = {
                                        regionId: $scope.regionRecord.region_type,
                                        regionName: $scope.regionRecord.region_name,
                                        regionType: $scope.regionRecord.region_type,
                                        extent: $scope.regionRecord.extent
                                    };
                                } else if ($scope.regionType) {
                                    scope.region = { regionType: $scope.regionType.region_type };
                                }
                                //console.log(scope.region);
                                modal.close();
                            };

                            $scope.regionSelected = function($item) {
                                $scope.regionRecord = $item;
                            };

                            $scope.searchRegion = function(text) {
                                $scope.regionRecord = undefined;
                                var region_type = $scope.regionType ? $scope.regionType.region_type : undefined;
                                return MOLApiX('searchregion',
                                    { type: region_type, name: text }
                                ).then(
                                    function(results) { return results.data; }
                                );
                            };
                        }
                    });
                });
            }
        };
    }]);
