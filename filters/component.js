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
.filter('taxa', ['$filter','$parse', function($filter,$parse) {
  return function (input, constraints) {
    if (input) {
      return input.map(
        function(record) {
          return angular.extend(
              record,
              {"species":$filter('taxon')(record.species,constraints)}
          );
        }
      );
    } else {
      return null;
    }
  }
}])
.filter('taxon',['$filter',function($filter) {
    return function(input,constraints) {
      if(input)
        return input.filter(
          function(sp) {
              return $filter('species')(sp,constraints);
          }
        );
    }
}])
.filter('species',function(){
  return function(input,constraints) {
    if(input) {
      if(
        ((input.elev_max>=constraints.elevation[0]&&
          input.elev_max<=constraints.elevation[1])||
        (input.elev_min>=constraints.elevation[0]&&
          input.elev_min<=constraints.elevation[1]))
        ||(input.elev_min<=constraints.elevation[0]&&
          input.elev_max>=constraints.elevation[1])||
          (input.elev_min === null && input.elev_min == null)) {
        return input;
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
