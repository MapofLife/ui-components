angular.module('mol-species-search-templates', ['mol-species-search-autocomplete.html', 'mol-species-search-control.html']);

angular.module("mol-species-search-autocomplete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-autocomplete.html",
    "<script type=text/ng-template id=ac-template.html><a class=\"searchResult\">\n" +
    "		<span class=\"sciName\" ng-bind-html=\"match.label.scientificname | uibTypeaheadHighlight:query\"></span>\n" +
    "	  <span class=\"commonName\" ng-bind-html=\"((match.label.vernacular) ? match.label.vernacular : '') | uibTypeaheadHighlight:query\"></span>\n" +
    "	</a></script><input class=form-control autocomplete=on ng-model=selected.value placeholder=\"Search for a species\" uib-typeahead=\"species.scientificname as species for species in searchSpecies(($viewValue)?$viewValue:'.')\" typeahead-on-select=selectSpecies($model) typeahead-template-url=ac-template.html>");
}]);

angular.module("mol-species-search-control.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-search-control.html",
    "<table class=search><tr><td><select placeholder=\"Select a group...\" class=form-control ng-model=groups.selected ng-options=\"group.value as group.label | capitalize for group in groups.available\"><option selected disabled>Select a group</option><option ng-value=null>All groups</option></select></td><td><span class=form-group><div ng-include=\"'mol-species-search-autocomplete.html'\"></div></span></td><td><button type=button ng-click=randomSpecies() class=\"random top_button btn btn-default\"><i class=\"fa fa-lg fa-random\"></i></button></td></tr></table>");
}]);
