angular.module('mol-loading-indicator-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-loading-indicator-main.html",
    "<div><i ng-show=processing ng-class=\"{processing: processing}\" class=\"fa fa-3x fa-refresh\"></i></div>");
}]);
