angular.module('mol-location-search-templates', ['mol-location-search-autocomplete.html', 'mol-location-search-control.html']);

angular.module("mol-location-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-location-search-autocomplete.html",
    "<style>mol-location-search .form-control {max-width:158px; min-width: 158px;}</style><ui-select ng-model=regions.selected style=max-width:158px;min-width:158px on-select=selectRegion($model)><ui-select-match placeholder=\"Select a region...\"><span ng-bind=$select.selected.name></span></ui-select-match><ui-select-choices repeat=\"region in (regions.available | filter: $select.search) track by region.region_id\"><span ng-bind=region.name></span></ui-select-choices></ui-select>");
}]);

angular.module("mol-location-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-location-search-control.html",
    "<table class=search><tr><td><i ng-click=global() uib-tooltip=\"Zoom to global scope.\" style=color:#ffffff class=\"clickable fa fa-globe fa-2x\"></i></td><td><span class=form-group><div ng-include=\"'mol-location-search-autocomplete.html'\"></div></span></td></tr></table>");
}]);
