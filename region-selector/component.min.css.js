(function () {
    // component.min.css
    var cssText = "" +
".region-selector .form-control{width:100%;max-width:100%}";
    // cssText end

    var styleEl = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText;
        } catch(e) {
            styleEl.innerText = cssText;
        }
    }
}());
