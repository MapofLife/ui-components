angular.module('mol-species-wiki-templates', ['mol-species-wiki-main.html']);

angular.module("mol-species-wiki-main.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mol-species-wiki-main.html",
    "<div class=col-md-12><div class=wiki ng-show=\"scientificname && wiki.content\">{{wiki.content}}</div><div ng-show=wiki.content>Source: <a ng-href=\"http://wikipedia.org/wiki/{{scientificname.replace(' ','_')}}\">Wikipedia</a></div></div>");
}]);
