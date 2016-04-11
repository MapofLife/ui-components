(function () {
    // component.min.css
    var cssText = "" +
".angular-leaflet-map svg{width:initial;height:initial}";
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
