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
              protocol: arguments[7] ,
          }
        }
        try {canceller = args.canceller.promise}
        catch(e) {canceller = undefined}
  			return $http({
  				method:'JSONP',
  				url: '{0}://{1}/{2}/{3}'.format(
            args.protocol || molConfig.protocol || 'https',
            args.url || molConfig.api_host || 'api.mol.org',
            args.version || molConfig.api || '1.0',
            args.service || ''),
  				params: angular.extend(args.params || {}, {callback: 'JSON_CALLBACK'}),
  				withCredentials: args.creds || false,
  				cache: true,
  				timeout: canceller,
  				ignoreLoadingBar: !args.loading
  			});
  		};
  	}
  ]);
