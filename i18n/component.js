angular.module('mol.i18n',['mol-i18n-templates'])
  .directive('molI18n', function() {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'mol-i18n-control.html',
      controller: [ '$rootScope','$scope','$translate','$cookies','$location','$window','$state',
      function($rootScope, $scope,$translate,$cookies,$location,$window,$state) {
        $scope.availLangs = $translate.getAvailableLanguageKeys();
        $scope.curLang = $translate.use();
        $scope.selLang = function(lang) {
          $translate.use(lang);
        }
        $rootScope.$on(
          '$translateChangeSuccess',function(e) {
            var newLang = $translate.use();
            if($state.params.lang) {
              $scope.curLang = newLang;
              $state.transitionTo(
                $state.current.name,
                angular.extend($state.params,{lang:newLang}),
                {reload: true}
              );
            } else {
              $location.path('/'+newLang+$location.path());
              $window.location=$location.protocol()+'://'
                +$location.host()+($location.port()?':'
                +$location.port():'')+$location.url();
            }
          }
        )
      }]
    };
});
