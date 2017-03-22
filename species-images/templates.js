angular.module('mol-species-images-templates', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put("mol-species-images-main.html",
    "<div ng-show=\"images.length>0\" ng-mouseover=\"showControls=true\" ng-mouseout=\"showControls=false\" class=species-images ng-style=\"{width: (size) ? size + 'px' : '100%', margin: '10px', minWidth:'80px', maxWidth: '320px'}\"><a href ng-click=fullsizeImage(selectedImage)><img ng-src=\"{{(images[selectedImage].asset_url || images[selectedImage].url)}}\"></a><div uib-collapse=!showControls ng-style=\"{width: size + 'px'}\" class=image-controls><i ng-show=loggedIn ng-click=vote(1) class=\"fa vote fa-thumbs-up fa-inverse\" ng-class=\"{voted: images[selectedImage].vote>0}\"></i> <i ng-show=loggedIn ng-click=vote(-1) class=\"fa vote fa-thumbs-down fa-inverse\" ng-class=\"{voted: images[selectedImage].vote<0}\"></i> <i ng-show=\"images.length>1\" ng-click=scrollImage(-1,false) class=\"fa scroller fa-chevron-left fa-inverse\"></i> <i ng-show=\"images.length>1\" ng-click=scrollImage(1,false) class=\"fa scroller fa-chevron-right fa-inverse\"></i></div><div ng-show=images[selectedImage].copyright uib-collapse=!showControls ng-style=\"{width: size + 'px'}\" class=image-rights><a ng-href={{images[selectedImage].license}} target=_license class=copyright><i class=\"fa fa-copyright\"></i>{{images[selectedImage].copyright}}</a></div></div>");
  $templateCache.put("mol-species-images-modal.html",
    "<div class=modal-body ng-swipe-left=Lightbox.nextImage() ng-swipe-right=Lightbox.prevImage()><div class=lb-nav><a class=lb-prev href=\"\" ng-click=Lightbox.prevImage()><span>PREV</span> </a><a class=lb-next href=\"\" ng-click=Lightbox.nextImage()><span>NEXT</span></a></div><div class=lightbox-image-container><img lightbox-src={{Lightbox.imageUrl}}></div><div class=imageDetailsWrapper><div ng-show=loggedIn class=imageVoteButtons><span><i ng-click=vote(1) class=\"fa fa-2x fa-thumbs-up vote\" ng-class=\"{voted: Lightbox.image.vote>0}\"></i> </span><span><i ng-click=vote(-1) class=\"fa fa-2x fa-thumbs-down vote\" ng-class=\"{voted: Lightbox.image.vote<0}\"></i></span></div><div class=imageCaption><span>{{ Lightbox.imageCaption }}</span></div></div></div>");
}]);
