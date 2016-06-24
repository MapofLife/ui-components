angular.module('mol-loading-indicator-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-loading-indicator-main.html",
    "<div><p>{{message}}</p><i ng-show=processing style=opacity:0.8 class=\"fa fa-3x fa-spin fa-refresh\"></i></div>");
}]);
