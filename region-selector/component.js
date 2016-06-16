angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', ['$modal', 'molApiX', function($modal, molApiX) {
        return {
            restrict: 'A',
            scope: {
                region: '=region',
                width: '=width',
                height: '=height'
            },
            controller: function($scope) {
                //molApiX('regiontypes').then(function(results) {
                    //$scope.regionTypes = results.data;
                    $scope.regionTypes = [{type: 'mountain_region', name: 'Mountain Region'}];
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
                                    scope.region = $scope.regionRecord;
                                } else if ($scope.regionType) {
                                    scope.region = { type: $scope.regionType.type };
                                }
                                //console.log(scope.region);
                                modal.close();
                            };

                            $scope.regionSelected = function($item) {
                                $scope.regionRecord = $item;
                            };

                            $scope.searchRegion = function(text) {
                                $scope.regionRecord = undefined;
                                var type = $scope.regionType ? $scope.regionType.type : undefined;
                                return molApiX('searchregion',
                                    { type: type, name: text }
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
