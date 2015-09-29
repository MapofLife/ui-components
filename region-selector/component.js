angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', ['$modal', function($modal) {
        return {
            restrict: 'A',
            scope: {
                location: '@molRegionSelector'
            },
            controller: function($scope) {
                $scope.regionTypes = [
                    {label: 'One', value: '1'},
                    {label: 'Two', value: '2'}
                ];
                $scope.regions = [
                    {},
                ];
            },
            link: function(scope, element, attrs, ctrl) {
                console.log(scope.regionTypes);
                element.bind('click', function() {
                    var modal = $modal.open({
                        animmation: true,
                        templateUrl: 'mol-region-selector.html',
                        controller: function($scope) {
                            $scope.regionTypes = {
                                selected:  {},
                                available: scope.regionTypes
                            };
                        }
                    });
                });
            }
        };
    }]);
