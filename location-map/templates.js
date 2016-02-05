angular.module('mol-location-map-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-location-map-main.html",
    "<leaflet paths=paths markers=markers center=center bounds=bounds width={{width}} layers=layers controls defaults=defaults height={{height}}></leaflet>");
}]);
