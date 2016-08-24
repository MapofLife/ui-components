angular.module('mol-species-description-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-species-description-main.html",
    "{{model.content}} <span ng-show=model.content>Source: <a ng-href=\"http://wikipedia.org/wiki/{{scientificname.replace(' ','_')}}\">Wikipedia</a></span>");
}]);
