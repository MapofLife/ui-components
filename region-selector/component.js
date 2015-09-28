angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', ['$modal', function($modal) {
        return {
            restrict: 'A',
            scope: {
                modalController: '@',
                location: '@molRegionSelector'
            },
            link: function(scope, element, attrs, ctrl) {
                console.log(scope.location);
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
