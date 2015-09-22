angular.module('mol.species-images',['mol-species-images-templates'])
.directive('molSpeciesImages', [
  '$state','$q','$timeout','$cookies','$modal','$http','GetImages',
  function($state,$q, $timeout,$cookies,$modal, $http, GetImages) {

    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname',
        size: '=size',
        scrolling: '=scrolling'
      },
      templateUrl: 'mol-species-images-main.html',
      controller: function($scope,$q, $state,$timeout,$cookies,$modal) {
        $scope.canceller = $q.defer();
        $scope.$watch(
          'scientificname',
          function(newValue,oldValue) {
            $scope.images = undefined;
            //if(!$scope.size) {
            //  $scope.size=80;
            //}
            if(newValue == undefined) {
              return;
            }
            GetImages(newValue,320).query(
              function(images){
                $scope.images = images;
                $scope.selectedImage = 0;
                if($scope.scrolling)
                $timeout(function(){$scope.scrollImage(1,true)},2000);
            });
          }
        );
        $scope.vote = function(vote) {
          //make api call for vote@asset_id
          $scope.scrolling = false;
          var currVote, newVote;
          if(!$cookies.muprsns) {
            $scope.loginModal();
          } else {
            currVote = $scope.images[$scope.selectedImage]["vote"];
            if( currVote == vote) {
              newVote = 0;
            } else {
              newVote = vote;
            }
            $scope.images[$scope.selectedImage]["vote"] = newVote;
            $http.get(
              'https://auth.mol.org/contribute/asset/{0}/vote/{1}'
                .format($scope.images[$scope.selectedImage]["asset_id"],newVote)
            ).success(
              function(response) {
                if (response.status == "success" && response.asset_id == $scope.images[$scope.selectedImage]["asset_id"]) {
                  $scope.images[$scope.selectedImage]["vote"] = response.vote_type;
                }
              }
            );
          }
        }
        $scope.scrollImage = function(increment, autoscroll) {
          var curPos = angular.copy($scope.selectedImage);
          if(!$scope.images) {return;}
          if(autoscroll==false) {
            $scope.scrolling=false
          };
          curPos+=increment;

          if(curPos>=($scope.images.length)) {curPos = 0}
          if(curPos<0) {curPos = $scope.images.length-1}
          $scope.selectedImage = curPos;
          if($scope.scrolling) {
            $timeout(function(){$scope.scrollImage(1, true)},5000);
          }
        }
        $scope.loginModal = function() {
          var modalInstance = $modal.open({
            templateUrl: 'modal.html',
            size: 'md',
            controller: function($scope, $modalInstance) {
                $scope.close = function () {
                  $modalInstance.dismiss('cancel');
                };
                $scope.location =  $location.absUrl();
              }
            });
        }


      }
    };
}]);
