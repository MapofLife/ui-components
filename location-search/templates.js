angular.module('mol-location-search-templates', ['mol-location-search-autocomplete.html', 'mol-location-search-control.html']);

angular.module("mol-location-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-location-search-autocomplete.html",
    "<script type=text/ng-template id=ac-region-template.html><a class=\"searchResult\">\n" +
    "	    <span class=\"commonName\" ng-bind-html=\"match.label.name | uibTypeaheadHighlight:query\"></span>\n" +
    "	</a></script><input class=form-control autocomplete=on ng-model=regions.selected.name placeholder=\"Select a region\" uib-typeahead=\"region for region in regions.available | filter:$viewValue | limitTo:50\" typeahead-on-select=selectRegion($model) typeahead-template-url=ac-region-template.html>");
}]);

angular.module("mol-location-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-location-search-control.html",
    "<table class=search><tr><td><select class=form-control ng-model=regionTypes.selected><option ng-selected=\"type.id === $parent.regionTypes.selected\" ng-value=type.id ng-repeat=\"type in regionTypes.available\">{{type.title | capitalize}}</option></select></td><td><span class=form-group><div ng-include=\"'mol-location-search-autocomplete.html'\"></div></span></td></tr></table>");
}]);
