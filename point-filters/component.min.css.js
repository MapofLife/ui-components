(function () {
    // component.min.css
    var cssText = "" +
".sliders{width:100%}.histogram_container{padding:10px 14px}.histogram_totals{float:right}.histogram_filter{padding-top:5px;padding-bottom:5px}.histogram{table-layout:fixed}.histogram .bar{text-align:center;background-color:#add8e6;height:0;width:100%;border-bottom:.8pt solid #000}.histogram .tick{text-align:center;height:4px;border-left:.8pt solid #000}.histogram .tick_label{text-align:center;font-size:6pt}.histogram .sliders{margin-left:-6px}";
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
