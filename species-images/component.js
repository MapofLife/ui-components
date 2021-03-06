angular.module('mol.species-images',['mol-species-images-templates'])
.directive('molSpeciesImages', [
  '$state','$q','$timeout','$cookies','molApi',
  function($state,$q, $timeout,$cookies, molApi) {

    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname',
        size: '=size',
        scrolling: '=scrolling'
      },
      templateUrl: 'mol-species-images-main.html',
      controller: function($scope,$q, $state,$timeout,$cookies) {
        $scope.canceller = $q.defer();
        $scope.images = undefined;
        $scope.loggedIn = ($cookies.muprsns !== undefined);
        $scope.$watch(
          'scientificname',
          function(n,o) {
            $scope.images = undefined;
            if(n) {
          molApi({
            "service": "species/images/list",
            "params" : {"scientificname":n}
          }).then(
              function(response) {
                try {
                $scope.images = response.data[0].images;
                $scope.selectedImage = 0;
                if($scope.scrolling)
                  $timeout(function(){$scope.scrollImage(1,true)},2000);
                } catch(e) {}
            });
           }
          }
        );


        $scope.vote = function(vote) {
          //make api call for vote@asset_id
          $scope.scrolling = false;
          var currVote, newVote;
          if($cookies.muprsns) {
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
      }
    };
}]);
