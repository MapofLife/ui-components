angular.module('mol.i18n',['mol-i18n-templates'])
  .directive('molI18n', function() {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-i18n-control.html',
      controller: [ '$rootScope','$scope','$translate','$cookies','$location',
      function($rootScope, $scope,$translate,$cookies,$location) {
        $scope.availLangs = $translate.getAvailableLanguageKeys();
        $scope.curLang = $translate.use();
        $scope.selLang = function(lang) {
          $translate.use(lang);
        }
        $rootScope.$on(
          '$translateChangeSuccess',function(e) {
            $scope.curLang = $translate.use();
          }
        )
      }]
    };
});
