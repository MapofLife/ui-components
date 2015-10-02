'use strict';

/* Filters */

angular.module('mol.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  // formats a number as a latitude (e.g. 40.46... => "40°27'44"N")
.filter('lat', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ns = input > 0 ? "N" : "S";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ns;
    }
})
// formats a number as a longitude (e.g. -80.02... => "80°1'24"W")
.filter('lon', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ew = input > 0 ? "E" : "W";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ew;
    }
})
.filter('mKm', ['$filter', function ($filter) {
    return function (input) {
        var out;
        if (input>=1000) {
          out = $filter('number')(input/1000) + ' km';
        } else {
          out = $filter('number')(input) + ' meters';
        }
        return out;
    }
}])
.filter('toArray', function() { return function(obj) {
    if (!(obj instanceof Object)) return obj;
    return _.map(obj, function(val, key) {
        return Object.defineProperty(val, '$key', {__proto__: null, value: key});
    });
}})
.filter('capitalize', function() {
  return function(input, scope) {
    if (input) {
      input = input.toLowerCase();
      return input.substring(0,1).toUpperCase()+input.substring(1);
    } else { return null}
  }
})
.filter('taxa', ['$filter', function($filter) {
  function taxaFilter (taxa, constraints) {
    var filtered = [];
    if (taxa) {
      taxa.map(
        function(taxon) {
          var fTaxon = taxon;
          fTaxon.species = $filter('taxon')(taxon.species,constraints)
          filtered.push(fTaxon)
        }
      );
      return filtered;
    } else { return null}
  }
  taxaFilter.$stateful = true;
  return taxaFilter;
}])
.filter('taxon',['$filter',function($filter) {
    return function(taxon,constraints) {
      if(taxon)
      return taxon.filter(
        function(species) {
            return $filter('species')(species,constraints);
        }
      );
    }
}])
.filter('species',function(){
  return function(species,constraints) {
    if(species) {
      if(
        ((species.elev_max>=constraints.elev.min&&
          species.elev_max<=constraints.elev.max)||
        (species.elev_min>=constraints.elev.min&&
          species.elev_min<=constraints.elev.max))
        ||(species.elev_min<=constraints.elev.min&&
          species.elev_max>=constraints.elev.max)) {
        return species;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
})
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
