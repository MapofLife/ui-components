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
            scope: { location: '@location' },
            controller: function($scope) {
                $http({
                    //url: 'http://api-beta.map-of-life.appspot.com//0.x/regiontypes',
                    url: 'http://api-beta.map-of-life.appspot.com//0.x/searchregion',
                    method: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    withCredentials: false,
                    params:{ 'auth_token': $cookies.get('muprsns') }
                }).then(function(results) {
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
                                $http({
                                    url: 'http://api-beta.map-of-life.appspot.com//0.x/searchregion?type=' +
                                         $scope.regionTypes.selected.region_type,
                                    method: 'GET',
                                    dataType: 'json',
                                    crossDomain: true,
                                    withCredentials: false,
                                    params:{ 'auth_token': $cookies.get('muprsns') }
                                }).then(function(results) {
                                    $scope.regions.available = results.data;
                                });
                            };
                        }
                    });
                });
            }
        };
    }]);
