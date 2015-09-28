angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', ['$modal', function($modal) {
        return {
            restrict: 'A',
            scope: {
                modalController: '@',
                regionType: '=',
                regionName: '=',
                size:       '=',
                scrolling:  '='
            },
            link: function(scope, element, attrs, ctrl) {
                element.bind('click', function() {
                    var modalInstance = $modal.open({
                        animmation: true,
                        templateUrl: 'mol-region-selector.html',
                        controller: scope.modalController,
                    });
                });
            }
        };
    }]);
