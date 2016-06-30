angular.module('mol.loading-indicator',['angular-loading-bar','mol-loading-indicator-templates'])
 .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = false;
    //cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.latencyThreshold = 100;
  }])
  .directive('molLoadingIndicator', [
    function() {
    return {
      restrict: 'E',
      scope: {},
      require: '^cfpLoadingBar',
      templateUrl: 'mol-loading-indicator-main.html',
      /*controllerAs: 'molLoadingIndicatorCtrl',*/
      controller: function($scope) {
        $scope.processing = false;
        $scope.$on(
          'cfpLoadingBar:started',
          function() {
            $scope.processing = true;
          }
        );
        $scope.$on(
          'cfpLoadingBar:completed',
          function() {
            $scope.processing = false;
          }
        );

      }
    };
}]);
