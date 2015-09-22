angular.module('mol.auth',['mol-auth-templates'])
  .factory(
    'molAuthLoginModal',
    ['$modal','$cookies',
    function ($modal,$cookies) {
      return function() {
        var modalInstance = $modal.open({
            templateUrl: 'mol-auth-modal.html',
            size: 'sm',
            controller: function($scope, $modalInstance) {
              $scope.login = function() {
                $http({
                   url:'https://auth.mol.org/api/login/cors',
                   method:"POST",
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   "ignoreLoadingBar": false,
                   data: {
                     "email": $scope.email,
                     "password": $scope.password,
                     "remember": ($scope.remember)?'yes':'no'
                   },
                   withCredentials: false
               })
               .then(
                  function(response) {
                    console.log(response);
                    $cookies.put(
                      'muprsns',
                      response.data.authtoken,
                      {path:'/',domain:'.mol.org'}
                    );
                    $scope.close();
                  }
                );
             }
                $scope.close = function () {
                  $modalInstance.dismiss('cancel');
                };
                $scope.location =  $location.absUrl();
              }
            });
          }
  }])
  .directive('molAuth', [
    '$state','$q','$timeout','$cookies','$modal','$location','$http',
    function($state,$q, $timeout,$cookies,$modal, $location, $http) {

    return {
      restrict: 'E',
      require: '',
      scope: {
        user: '=user'
      },
      templateUrl: 'mol-auth-control.html',
      controller: function($scope,$q, $state,$timeout,$cookies,$modal,$location) {
        $scope.init = undefined;
        $scope.getUser = function() {
          if($cookies.get("muprsns")) {
            try{
              $http({
                url:'https://auth.mol.org/api/me',
                method:'GET',
                params:{
                  'auth_token':$cookies.get("muprsns")
                },
                withCredentials: false})
                  .then(function(response) {
                      console.log(response);
                      if(response.data.fullname) {
                        $scope.user = response.data;
                        $scope.init = true;
                      }
                    });
              } catch(e) {$scope.init=true;}
            } else {
              $scope.init = true;
            }
        }

        $scope.logout = function() {
           $cookies.remove(
             'muprsns',
             {path:'/',domain:'.mol.org'}
           );
           delete $scope.user;
        }

        $scope.$watch(
          function(){return $cookies.get("muprsns")},
          function(newValue,oldValue) {
            if(newValue) {
              $scope.getUser();
            }
          }
        )



        $scope.loginModal = function() {
          var modalInstance = $modal.open({
            templateUrl: 'mol-auth-modal.html',
            size: 'sm',
            controller: function($scope, $modalInstance) {
              $scope.login = function() {
                $http({
                   url:'https://auth.mol.org/api/login/cors',
                   method:"POST",
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   "ignoreLoadingBar": false,
                   data: {
                     "email": $scope.email,
                     "password": $scope.password,
                     "remember": ($scope.remember)?'yes':'no'
                   },
                   withCredentials: false
               })
               .then(
                  function(response) {
                    console.log(response);
                    $cookies.put(
                      'muprsns',
                      response.data.authtoken,
                      {path:'/',domain:'.mol.org'}
                    );
                    $scope.close();
                  }
                );
             }
                $scope.close = function () {
                  $modalInstance.dismiss('cancel');
                };
                $scope.location =  $location.absUrl();
              }
            });
        }
        $scope.getUser();
      }
    };
}]);
