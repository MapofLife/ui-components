angular.module('mol.map',['mol-map-templates'])
  .directive('molMap', [
    '$compile','$http','$window',
    function($compile,$http,$window) {
      return {
        restrict: 'AE',
        scope: {
          baselayers: '=baselayers',
          overlays: '=overlays',
          utfgrid: '=grid',
          click: '=click',
          hover: '=move',
          bounds: '=bounds',
          infoTemplate: '=infoTemplate',
          width: '=width',
          height: '=height'
        },
        templateUrl: 'mol-map-main.html',
        link: function(scope, element, attr) {
          function initMap() {
            scope.map = new google.maps.Map(element[0],{});
            addResizeListener(
              element.context,
              function() {
                var center = scope.map.getCenter();
                google.maps.event.trigger(scope.map, "resize");
                scope.map.setCenter(center);
              });
          }

          if(typeof google == undefined) {
            $http.jsonp(
              'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=JSON_CALLBACK',
              function(response) {
                eval(response.data);
                $window.google = google;
                initMap();
              });
          } else {
            initMap();
          }




        },
        controller: function($scope, $element) {
        }
      };
    }
  ]);
