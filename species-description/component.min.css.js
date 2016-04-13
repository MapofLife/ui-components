(function () {
    // component.min.css
    var cssText = "" +
".species-images{display:inline-block;position:relative;border:1pt solid gray;border-radius:5pt;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin:10px}.species-images .image-controls{color:#d3d3d3;position:absolute;bottom:0;width:100%;background-color:rgba(0,0,0,.5);padding:5px}.species-images .image-rights{position:absolute;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:8pt;color:#d3d3d3;top:0;width:100%;background-color:rgba(0,0,0,.5);padding:5px}.species-images .image-rights .copyright{color:#d3d3d3}.species-images .voted{color:#37F}.species-images .scroller{padding:1pt;cursor:pointer}.species-images .vote{float:right;padding:1pt;cursor:pointer}.species-images i{cursor:pointer}";
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
