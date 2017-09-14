angular.module('mol-species-description-templates', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put("mol-species-description-main.html",
    "{{model.content}} <span ng-show=model.content class=pull-right><br><span translate>source</span>: <a ng-href=\"http://{{model.lang}}.wikipedia.org/wiki/{{scientificname.replace(' ','_')}}\" target=_blank>Wikipedia</a></span>");
}]);
