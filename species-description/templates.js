angular.module('mol-species-description-templates', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put("mol-species-description-main.html",
    "{{model.content}} <span ng-show=model.content class=pull-right><br><span translate>source</span>: <a ng-href=\"http://{{model.lang}}.wikipedia.org/wiki/{{scientificname.replace(' ','_')}}\" target=_blank>Wikipedia</a></span><div ng-show=\"contentMode == 1\"><em translate>loading_content</em></div><div ng-show=\"contentMode == 2\"><em translate>no_content_available</em></div>");
}]);
