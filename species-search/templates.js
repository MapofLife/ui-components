angular.module('mol-species-search-templates', ['mol-species-search-autocomplete.html', 'mol-species-search-control.html']);

angular.module("mol-species-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-autocomplete.html",
    "<script type=text/ng-template id=ac-template.html><a class=\"searchResult\">\n" +
    "		<span class=\"sciName\" ng-bind-html=\"match.label.scientificname | uibTypeaheadHighlight:query\"></span>\n" +
    "	  <span class=\"commonName\" ng-bind-html=\"match.label.vernacular | uibTypeaheadHighlight:query\"></span>\n" +
    "	</a></script><input class=form-control autocomplete=on ng-model=selected.value placeholder=\"Select a species\" uib-typeahead=\"species.scientificname as species for species in searchSpecies($viewValue)\" typeahead-on-select=selectSpecies($model) typeahead-template-url=ac-template.html>");
}]);

angular.module("mol-species-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-control.html",
    "<table class=search><tr><td><select class=form-control ng-model=groups.selected><option disabled>Select a group...</option><option ng-selected=\"group.value === $parent.groups.selected\" ng-value=group.value ng-repeat=\"group in groups.available\">{{ group.label | capitalize}}</option></select></td><td><span class=form-group><div ng-include=\"'mol-species-search-autocomplete.html'\"></div></span></td></tr></table>");
}]);
