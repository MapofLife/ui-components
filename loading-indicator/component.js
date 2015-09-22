angular.module('mol.loading-indicator',['mol-loading-indicator-templates'])
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
