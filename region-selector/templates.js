angular.module('mol-region-selector-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-region-selector.html",
    "<div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-label=Close ng-click=$close()><span aria-hidden=true>&times;</span></button><h4 class=modal-title id=region-selector-label>Select Region</h4></div><div class=modal-body>Controls to select the region go here.</div><div class=modal-footer><button type=button class=\"btn btn-default\" data-dismiss=modal aria-label=Close ng-click=$close()>Cancel</button> <button type=button class=\"btn btn-primary\">Select</button></div></div>");
}]);
