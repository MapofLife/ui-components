// Start disabled
angular.module('mol.region-selector', ['mol-region-selector-templates'])
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .directive('molRegionSelector', [
            '$modal', '$http', '$cookies',
            function($modal, $http, $cookies) {
        return {
            restrict: 'A',
            scope: {
                location: '@molRegionSelector'
            },
            controller: function($scope) {
                $http({
                    url:    'http://api-beta.map-of-life.appspot.com//0.x/searchregion',
                    method: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    params:{
                      'auth_token': $cookies.get('muprsns')
                    },
                    withCredentials: false
                }).then(function(results) {
                    var regionType = {};
                    $scope.regionTypes = [];
                    $scope.allRegions = results.data;
                    angular.forEach(results.data, function(region) {
                        if (! regionType[region.region_type]) {
                            regionType[region.region_type] = 1;
                            $scope.regionTypes.push({
                                region_type: region.region_type,
                                region_name: region.region_type
                                                   .replace('_', ' ')
                                                   .replace(/\w\S*/g, function(str) {
                                                        return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
                                                   })
                            });
                        }
                    });
                    $scope.regionTypes.sort(function(a, b) {
                        return +(a.label > b.label) || +(a.label === b.label) - 1;
                    });
                    //$scope.regions.sort(function(a, b) {
                    //    return +(a.label > b.label) || +(a.label === b.label) - 1;
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
                                available: scope.allRegions
                            };
                            $scope.regionSelected = function() {
                                console.log($scope.regions.selected);
                            };
                            $scope.regionTypeSelected = function() {
                                console.log($scope.regionTypes.selected);
                            };
                        }
                    });
                    // Select button action
                });
            }
        };
    }]);
