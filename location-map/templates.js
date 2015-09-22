angular.module('mol-location-map-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-location-map-main.html",
    "<leaflet paths=paths markers=markers center=center width={{width}} layers=layers defaults=defaults height={{height}}></leaflet>");
}]);
