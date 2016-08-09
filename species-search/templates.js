angular.module('mol-species-search-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-species-search-autocomplete.html",
    "<script type=text/ng-template id=ac-template.html><a class=\"searchResult\">\n" +
    "		<span class=\"sciName\" ng-bind-html=\"match.label.scientificname | uibTypeaheadHighlight:query\"></span>\n" +
    "	  <span class=\"commonName\" ng-bind-html=\"((match.label.vernacular) ? match.label.vernacular : '') | uibTypeaheadHighlight:query\"></span>\n" +
    "	</a></script><script type=text/ng-template id=popup-template.html><div class=\"custom-popup-wrapper\">\n" +
    "		 <ul class=\"dropdown-menu ng-isolate-scope\"\n" +
    "		 		ng-show=\"isOpen() && !moveInProgress\"\n" +
    "				style=\"position:absolute;\"\n" +
    "				ng-style=\"{top: position().top+'px', right: position().right+'px'}\"\n" +
    "				role=\"listbox\" aria-hidden=\"false\"\n" +
    "				uib-typeahead-popup=\"\"\n" +
    "				matches=\"matches\" active=\"activeIdx\"\n" +
    "				select=\"select(activeIdx, evt)\"\n" +
    "				move-in-progress=\"moveInProgress\" query=\"query\"\n" +
    "\n" +
    "				assign-is-open=\"assignIsOpen(isOpen)\" debounce=\"debounceUpdate\" template-url=\"ac-template.html\">\n" +
    "     </ul>\n" +
    "  </div></script><input class=form-control style=max-width:158px autocomplete=on ng-model=selected.value placeholder=\"Search for a species\" uib-typeahead=\"species.scientificname as species for species in searchSpecies(($viewValue)?$viewValue:'.')\" typeahead-on-select=selectSpecies($model) typeahead-template-url=ac-template.html>");
  $templateCache.put("mol-species-search-control.html",
    "<table class=search><tr><td><select style=max-width:158px;width:158px placeholder=\"Select a group...\" class=form-control ng-model=groups.selectedIndex ng-change=\"groups.selected = groups.available[groups.selectedIndex].taxa\"><option ng-value=null>All groups</option><option ng-value=$index ng-repeat=\"group in groups.available\">{{group.label | capitalize}}</option></select></td><td><span class=form-group><div ng-include=\"'mol-species-search-autocomplete.html'\" style=position:relative></div></span></td></tr></table>");
}]);
