angular.module('mol.api',[])
  .factory('molApi', ['molConfig','$http', function(molConfig,$http) {
  		return function() {
        var args,canceller;
        if (arguments.length == 1 && typeof arguments[0] === "object") {
          args = arguments[0];
        } else {
          args = {
              url:  arguments[0],
              version:  arguments[1],
              service:  arguments[2],
              params:  arguments[3],
              canceller: arguments[4].promise || {},
              loading: arguments[5],
              creds: arguments[6],
              protocol: arguments[7],
              method: arguments[8]
          }
        }
        try {canceller = args.canceller.promise}
        catch(e) {canceller = undefined}
        
        jsonpCallback = { callback: 'JSON_CALLBACK' };
        if (angular.version.major == 1 && angular.version.minor > 5) {
          jsonpCallback = { jsonpCallbackParam: 'callback' };
        }

  			return $http({
  				method: args.method || 'JSONP',
  				url: '{0}://{1}/{2}/{3}'.format(
            args.protocol || molConfig.protocol || 'https',
            args.url || molConfig.api_host || 'api.mol.org',
            args.version || molConfig.api || '1.0',
            args.service || ''),
          params: (args.method !== 'POST') ? angular.extend(args.params || {}, jsonpCallback): undefined,
          data: args.data,
  				withCredentials: args.creds || false,
  				cache: true,
  				timeout: canceller,
  				ignoreLoadingBar: !args.loading
  			});
  		};
  	}
  ]);
