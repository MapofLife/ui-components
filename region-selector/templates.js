angular.module('mol-region-selector-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-region-selector.html",
    "<div class=modal-content><div class=modal-header><button type=button ng-click=$close() tabindex=-1 class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h4 class=modal-title>Select Region</h4></div><div class=\"modal-body region-selector\"><div class=row><div class=\"form-group col-md-6 col-xs-12\"><select placeholder=\"Select a Region Type\" class=form-control autofocus ng-model=$parent.regionType><option disabled>{{$select.selected.name}}</option><option ng-repeat=\"reg in regionTypes | filter: $select.search\" ng-bind-html=reg.name value=reg></option></select></div><div class=\"form-group col-md-6 col-xs-12\"><input class=form-control autocomplete=on ng-model=regionName.value placeholder=\"Select a Region\" typeahead=\"reg.name for reg in searchRegion($viewValue)\" typeahead-on-select=regionSelected($item)></div></div><div class=modal-footer><button type=button class=\"btn btn-default\" tabindex=-1 data-dismiss=modal aria-label=Close ng-click=$close()>Cancel</button> <button type=button ng-click=regionSelectionComplete() ng-disabled=\"!(regionRecord || regionType)\" class=\"btn btn-primary\">Select</button></div></div></div>");
}]);
