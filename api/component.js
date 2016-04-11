angular.module('mol.api',[])
  .factory('MOLApi', ['$http', function($http) {
  		return function() {
        var args;
        if (arguments.length == 1 && typeof arguments[0] === "object") {
          args = arguments[0];
        } else {
          args = {
              url:  arguments[0],
              version:  arguments[1],
              service:  arguments[2],
              params:  arguments[3],
              canceller: arguments[4],
              loading: arguments[5],
              creds: arguments[6]
          }
        }

  			return $http({
  				method:'JSONP',
  				url: '//{0}/{1}/{2}'.format(
            args.url || 'api.mol.org',
            args.version || '0.x',
            args.service || ''),
  				params: angular.extend(args.params || {}, {callback: 'JSON_CALLBACK'}),
  				withCredentials: args.creds || false,
  				cache: true,
  				timeout: args.canceller.promise || undefined,
  				ignoreLoadingBar: args.loading || false
  			});
  		};
  	}
  ]);
