angular.module('mol-species-search-templates', ['mol-species-search-autocomplete.html', 'mol-species-search-control.html']);

angular.module("mol-species-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-autocomplete.html",
    "<script type=text/ng-template id=ac-template.html><a class=\"searchResult\">\n" +
    "		<span class=\"sciName\" ng-bind-html=\"match.label.n | uibTypeaheadHighlight:query\"></span>\n" +
    "	  <span class=\"commonName\" ng-bind-html=\"match.label.v | uibTypeaheadHighlight:query\"></span>\n" +
    "	</a></script><input class=form-control autocomplete=on ng-model=selected.value placeholder=\"Select a species\" uib-typeahead=\"species.n as species for species in searchSpecies($viewValue)\" typeahead-on-select=selectSpecies($model) typeahead-template-url=ac-template.html>");
}]);

angular.module("mol-species-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-control.html",
    "<table class=search><tr><td><select class=form-control ng-model=groups.selected><option ng-selected=\"groups.selected==null\" value=\"\" disabled>Select a group...</option><option ng-selected=\"group.value === groups.selected.value\" ng-value=group ng-repeat=\"group in groups.available\">{{ group.label | capitalize}}</option></select></td><td><span class=form-group><div ng-include=\"'mol-species-search-autocomplete.html'\"></div></span></td><td class=hidden-xxs><button type=button ng-click=randomSpecies() class=\"random top_button btn btn-default\">Pick random</button></td></tr></table>");
}]);
