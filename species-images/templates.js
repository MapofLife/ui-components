angular.module('mol-species-images-templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("mol-species-images-main.html",
    "<div ng-show=images ng-mouseover=\"showControls=true\" ng-mouseout=\"showControls=false\" class=species-images ng-style=\"{width: (size) ? size + 'px' : '100%', margin: '10px', minWidth:'80px', maxWidth: '320px'}\"><a href ng-click=fullsizeImage(selectedImage)><img height=100% width=100% src=\"{{(images[selectedImage].asset_url || images[selectedImage].url)}}\"></a><div uib-collapse=!showControls ng-style=\"{width: size + 'px'}\" class=image-controls><i ng-show=loggedIn ng-click=vote(1) class=\"fa vote fa-thumbs-up fa-inverse\" ng-class=\"{voted: images[selectedImage].vote>0}\"></i> <i ng-show=loggedIn ng-click=vote(-1) class=\"fa vote fa-thumbs-down fa-inverse\" ng-class=\"{voted: images[selectedImage].vote<0}\"></i> <i ng-show=\"images.length>1\" ng-click=scrollImage(-1,false) class=\"fa scroller fa-chevron-left fa-inverse\"></i> <i ng-show=\"images.length>1\" ng-click=scrollImage(1,false) class=\"fa scroller fa-chevron-right fa-inverse\"></i></div><div ng-show=images[selectedImage].copyright uib-collapse=!showControls ng-style=\"{width: size + 'px'}\" class=image-rights><a ng-href={{images[selectedImage].license}} target=_license class=copyright><i class=\"fa fa-copyright\"></i>{{images[selectedImage].copyright}}</a></div></div>");
  $templateCache.put("mol-species-images-modal.html",
    "<div class=modal-header><i class=\"fa fa-close close\" ng-click=close()></i><h3 class=modal-title>Please login</h3></div><div class=modal-body>This feature is available for registered users. Please <a ng-href=\"https://auth.mol.org/login?next={{location}}\">login</a> or <a ng-href=\"https://auth.mol.org/register?next={{location}}\">register</a> to use this feature.</div>");
}]);
