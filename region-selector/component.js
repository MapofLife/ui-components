angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .directive('molRegionSelector', [function() {
        return {
            restrict: 'E',
            scope: {
                regionType: '=',
                regionName: '=',
                size:       '=',
                scrolling:  '='
            },
            templateUrl: 'mol-region-selector.html',
            link: function(scope, element, attrs, ctrl) {
            }
        };
    }]);
