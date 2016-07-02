/*! 2016-07-01 */
angular.module("mol-point-filters-templates",[]).run(["$templateCache",function($templateCache){$templateCache.put("mol-point-filters-control.html",'<div class=well ng-show="initialized && histogram.histogram_values"><div><b>Point filters</b><div class=histogram_totals>{{totals.combined | number}} of {{totals.total | number}} selected</div><div class=histogram_filter><checkbox class=btn-primary ng-model=filters.uncertainty></checkbox>&nbsp;<b class=clickable uib-tooltip="\n      Spatial uncertainty of an observation, in kilometers. 20km if no uncertainty is provided with the observation.">Uncertainty</b><div class=histogram_totals>{{totals.uncertainty | number}} selected</div><div class=histogram_container><table class=histogram width=100%><tr><td colspan=1></td><td valign=bottom colspan=2 ng-repeat="bucket in histogram.uncertainty_buckets | toArray"><div class=bar tooltip-placement=right uib-tooltip="{{bucket.ct | number}} point records available with a geographic uncertainty between {{bucket.min | mKm}} and {{bucket.max | mKm}}." ng-style={height:bucket.height}></div></td><td colspan=1></td></tr><tr><td colspan=1></td><td colspan=2 halign=middle valign=bottom ng-repeat="bucket in histogram.uncertainty_buckets | toArray"><div class=tick></div></td><td colspan=1><div class=tick></div></td></tr><tr><td valign=bottom halign=middle colspan=2 ng-repeat="bucket in histogram.uncertainty_buckets | toArray"><div ng-class-even="\'tick_label_odd\'" class=tick_label>{{bucket.min/1000}}</div></td><td colspan=2><div class=tick_label>&infin;</div></td></tr><tr><td colspan="{{((histogram.uncertainty_buckets | toArray).length+1)*2+1}}"><div class=sliders range-slider show-values=false step=1 min=1 max=steps.uncertainty_bucket prevent-equal-min-max ng-mouseup=updateModel() model-min=selected.uncertainty.min model-max=selected.uncertainty.max></div></td></tr></table></div></div><div class=histogram_filter><checkbox class=btn-primary ng-model=filters.years></checkbox>&nbsp;<b>Years</b><div class=histogram_totals>{{totals.years | number}} selected</div><div class=histogram_container><table class=histogram width=100%><tr><td valign=bottom colspan=2><div class=bar tooltip-placement=right uib-tooltip="{{histogram.year_buckets[\'0\'].ct}} point records available with no year value." ng-style="{height:histogram.year_buckets[\'0\'].height}"></div></td><td colspan=3 halign=middle valign=bottom></td><td colspan=2 halign=middle valign=bottom ng-repeat="bucket in (histogram.year_buckets | toArray).splice(1)"><div class=bar tooltip-placement=right uib-tooltip="{{bucket.ct | number}} point records available between {{(bucket.min > 0) ? bucket.min : \'the beginning of time\'}} and {{(bucket.max < 2015)?bucket.max:\' the present\'}}." ng-style={height:bucket.height}></div></td><td colspan=1></td></tr><tr><td colspan=1></td><td colspan=2 halign=middle valign=bottom><div class=tick></div></td><td colspan=2 halign=middle valign=bottom></td><td colspan=2 halign=middle valign=bottom ng-repeat="bucket in (histogram.year_buckets | toArray).slice(1)"><div class=tick></div></td><td colspan=1><div class=tick></div></td></tr><tr><td colspan=2 halign=middle valign=bottom><div class=tick_label>N/A</div></td><td colspan=2 halign=middle valign=bottom></td><td colspan=2 halign=middle ng-repeat="bucket in (histogram.year_buckets | toArray).slice(1)"><div ng-class-even="\'tick_label_odd\'" class=tick_label>{{(bucket.min>0)? bucket.min : \'BC\'}}</div></td><td colspan=2 halign=middle><div class=tick_label>Now</div></td></tr><tr><td uib-tooltip="Check to include points with no year recorded." tooltip-placement=right halign=middle style=text-align:center colspan=2><checkbox class=btn-primary ng-model=year.nulls></checkbox></td><td colspan=2></td><td colspan="{{((histogram.year_buckets | toArray).length)*2+1}}"><div class=sliders range-slider show-values=false step=1 min=1 max=steps.year_bucket-1 prevent-equal-min-max ng-mouseup=updateModel() model-min=selected.year.min model-max=selected.year.max></div></td></tr></table></div><div ng-show="totals.total>5000" class=histogram_filter><checkbox class=btn-primary ng-model=filters.limit></checkbox>&nbsp;Limit map to most recent {{limit}} points.<div style=width:90%;margin:5px range-slider show-values=false step=500 min=0 max=50000 pin-handle=min prevent-equal-min-max ng-mouseup=updateModel() model-max=selected.limit></div></div></div></div></div>')}]),function(){var cssText=".sliders{width:100%}.histogram_container{padding:10px 14px}.histogram_totals{float:right}.histogram_filter{padding-top:5px;padding-bottom:5px}.histogram{table-layout:fixed}.histogram .bar{text-align:center;background-color:#add8e6;height:0;width:100%;border-bottom:.8pt solid #000}.histogram .tick{text-align:center;height:4px;border-left:.8pt solid #000}.histogram .tick_label{text-align:center;font-size:6pt}.histogram .sliders{margin-left:-6px}points-histogram .btn{width:25px;height:25px}",styleEl=document.createElement("style");if(document.getElementsByTagName("head")[0].appendChild(styleEl),styleEl.styleSheet)styleEl.styleSheet.disabled||(styleEl.styleSheet.cssText=cssText);else try{styleEl.innerHTML=cssText}catch(e){styleEl.innerText=cssText}}();