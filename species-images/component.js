angular.module('mol.species-images', ['bootstrapLightbox', 'mol-species-images-templates'])
  .config(function (LightboxProvider) {
    
    LightboxProvider.fullScreenMode = true;
    LightboxProvider.templateUrl = 'mol-species-images-modal.html';

    LightboxProvider.getImageUrl = function (image) {
      var url = image.asset_url || image.url;
      url = (url.includes('=s')) ? url.substring(0, url.indexOf('=s')) : url;
      return url;
    };

    LightboxProvider.getImageCaption = function (image) {
      var rights = "";
      
      if ( isValid(image.copyright) || isValid(image.license) ) {
        var lic = "";
        if (isValid(image.license)) {
          var pos = image.license.indexOf("creativecommons.org");
          if (pos > 0) {
            pos += 29;
            lic = "CC " + image.license.substring(pos);
            lic = lic.replace(/\//g, ' ').toUpperCase();
          } 
        }

        rights = (isValid(image.copyright))?image.copyright : "";
        if (isValid(rights) && isValid(lic)) {
          rights = "\u00A9 " + rights + " / ";
        }
        rights += lic;
      }

      return rights;
    };        

    function isValid(str) {
      if (str) {
        if (typeof (str) == "string") {
          if (str.length > 0) {
            return true;
          }
        }
      }
      return false;
    }
  })
.directive('molSpeciesImages', [
  '$state', '$q', '$timeout', '$cookies', 'molApi', 'Lightbox', 
  function ($state, $q, $timeout, $cookies, molApi, Lightbox) {

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
        $scope.loggedIn = ($cookies.get('muprsns') !== undefined);
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
                $scope.images = response.data[0].images.map(function(i) {
                  return angular.extend(i,
                    {"asset_url": (!i.asset_url.includes('=s' + ($scope.size || 80) + '-c'))? i.asset_url + '=s' + ($scope.size || 80) + '-c' : i.asset_url})
                  });
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
          if ($cookies.get('muprsns')) {
            currVote = $scope.images[$scope.selectedImage]["vote"];
            if( currVote == vote) {
              newVote = 0;
            } else {
              newVote = vote;
            }
            $scope.images[$scope.selectedImage]["vote"] = newVote;
            molApi({
              "service": "species/images/vote",
              "params": { "asset_id": $scope.images[$scope.selectedImage]["asset_id"], "vote_value": newVote}
            }).then(
              function (response) {
                if (response.status == "success" 
                    && response.data 
                    && response.data.length > 0 
                    && response.asset_id == $scope.images[$scope.selectedImage]["asset_id"]) {
                  $scope.images[$scope.selectedImage]["vote"] = response.data[0].vote_type;
                }
              });            
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

        $scope.fullsizeImage = function (selectedImage) {
          Lightbox.openModal($scope.images, selectedImage, { scope: $scope });
        }
      }
    };
}]);
