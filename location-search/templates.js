angular.module('mol-location-search-templates', ['mol-location-search-autocomplete.html', 'mol-location-search-control.html', 'mol-species-search-autocomplete.html', 'mol-species-search-control.html']);

angular.module("mol-location-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-location-search-autocomplete.html",
    "<select placeholder=\"Select a region...\" class=form-control ng-model=regions.selected style=max-width:158px;min-width:158px><option ng-repeat=\"region in (regions.available | filter: $select.search) track by region.region_id\" ng-bind-html=region.name ng-value=region></option></select>");
}]);

angular.module("mol-location-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-location-search-control.html",
    "<table class=search><tr><td><i ng-click=global() uib-tooltip=\"Zoom to global scope.\" style=color:#ffffff class=\"clickable fa fa-globe fa-2x\"></i></td><td><span class=form-group><div ng-include=\"'mol-location-search-autocomplete.html'\"></div></span></td></tr></table>");
}]);

angular.module("mol-species-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-autocomplete.html",
    "<script type=text/ng-template id=ac-template.html><a class=\"searchResult\">\n" +
    "		<span class=\"sciName\" bind-html-unsafe=\"match.label.n | typeaheadHighlight:query\"></span>\n" +
    "	    <span class=\"commonName\" bind-html-unsafe=\"match.label.v | typeaheadHighlight:query\"></span>\n" +
    "	</a></script><input class=form-control autocomplete=on ng-model=selected.value placeholder=\"Select a species\" typeahead=\"species.n as species for species in searchSpecies($viewValue)\" typeahead-on-select=selectSpecies($model) typeahead-template-url=ac-template.html>");
}]);

angular.module("mol-species-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-control.html",
    "<table class=search><tr><td><ui-select ng-model=groups.selected><ui-select-match class=group-label placeholder=\"Select a group...\">{{$select.selected.label}}&nbsp;&nbsp;</ui-select-match><ui-select-choices repeat=\"group in groups.available track by $index\"><div ng-bind-unsafe-html=\"group.label | uppercase\"></div><small class=group-label>{{ group.label }}</small></ui-select-choices></ui-select></td><td><span class=form-group><div ng-include=\"'mol-species-search-autocomplete.html'\"></div></span></td><td class=hidden-xxs><button type=button ng-click=randomSpecies() class=\"random top_button btn btn-default\">Pick random</button></td></tr></table>");
}]);
