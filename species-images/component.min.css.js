(function () {
    // component.min.css
    var cssText = "" +
".species-images{display:inline-block;position:relative;border:1pt solid gray;border-radius:5pt;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin:10px}.species-images .image-controls{color:#d3d3d3;position:absolute;bottom:0;width:100%;background-color:rgba(0,0,0,.5);padding:5px}.species-images .image-rights{position:absolute;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:8pt;color:#d3d3d3;top:0;width:100%;background-color:rgba(0,0,0,.5);padding:5px}.species-images .image-rights .copyright{color:#d3d3d3}.imageVoteButtons .voted,.species-images .voted{color:#37F}.species-images .scroller{padding:1pt;cursor:pointer}.species-images .vote{float:right;padding:1pt;cursor:pointer}.species-images i{cursor:pointer}.imageDetailsWrapper{position:absolute;bottom:-34px;left:0;width:100%;padding:10px;border-radius:0 0 5px 5px;line-height:33px;text-align:left;background-color:rgba(0,0,0,.8);color:#fff;z-index:10}.imageVoteButtons{float:right}.imageVoteButtons span{margin-right:15px;color:#fff;cursor:pointer}.imageVoteButtons span i{-moz-transition:transform .2s ease,background .2s ease,box-shadow .25s ease;-webkit-transition:transform .2s ease,background .2s ease,box-shadow .25s ease;transition:transform .2s ease,background .2s ease,box-shadow .25s ease}.imageVoteButtons span i:hover{-webkit-transform:translateY(-3px);-ms-transform:translateY(-3px);transform:translateY(-3px);text-shadow:0 3px 8px rgba(255,255,255,.4),0 -5px 8px rgba(255,255,255,.4)}.lb-nav{position:absolute;top:0;left:0;height:100%;width:100%;z-index:10}.lb-container>.nav{left:0}.lb-nav a{outline:0}.lb-nav a:active,.lb-nav a:focus,.lb-nav a:hover{background-color:transparent;text-shadow:0 3px 8px rgba(255,255,255,.4),0 -5px 8px rgba(255,255,255,.4)}.lb-next,.lb-prev{height:100%;cursor:pointer;display:block}.lb-nav a span{position:absolute;top:50%;padding:15px;font-size:1.3em;font-weight:400;color:#fff;background-color:rgba(0,0,0,.3)}.lb-nav a.lb-prev span{left:0;border-radius:0 5px 5px 0}.lb-nav a.lb-next span{right:0;border-radius:5px 0 0 5px}.lb-nav a.lb-prev{width:34%;left:0;top:50%;float:left;-webkit-transition:opacity .6s;-moz-transition:opacity .6s;-o-transition:opacity .6s;transition:opacity .6s}.lb-nav a.lb-next{width:64%;top:50%;right:0;float:right;-webkit-transition:opacity .6s;-moz-transition:opacity .6s;-o-transition:opacity .6s;transition:opacity .6s}";
    // cssText end

    var styleEl = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText
        } catch(e) {
            styleEl.innerText = cssText;
        }
    }
}());
