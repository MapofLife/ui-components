angular.module('mol-i18n-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-i18n-control.html",
    "<span ng-repeat=\"lang in availLangs\" ng-bind-html=lang style=\"padding:0.5pt 2pt;border-radius:4pt\" ng-style=\"{'cursor' : (curLang===lang)? 'default':'pointer',\n" +
    "             'text-decoration' : (curLang===lang)? 'underline':''\n" +
    "           }\" ng-click=selLang(lang)></span>");
}]);
