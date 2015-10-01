'use strict';

angular.module('mol.services', ['ngResource'])
//Generic service for calling the MOL v0.1 API
	.factory(
		'MOLApi',
		['$http',
			function($http) {
				return function(service, params, canceller, loading) {
					loading = (typeof loading === undefined) ? false : loading;
					return $http({
						method:'GET',
						url: 'https://api.mol.org/0.1/{0}'.format(
							service),
						params: angular.extend(params,{"cache_buster":true,"lang":"en"}),
						withCredentials: false,
						cache: true,
						timeout: (canceller) ? canceller.promise : undefined,
						ignoreLoadingBar: loading
						});
				}
			}
		])
//Generic service for calling the MOL v0.1 API
	.factory(
		'MOLApiX',
		['$http',
			function($http) {
				return function(service, params, version, canceller, loading) {
					if (version === undefined ) {
						version = '0.x';
					}
					loading = (typeof loading === undefined) ? false : loading;
					return $http({
						method:'GET',
						url: 'http://api-beta.map-of-life.appspot.com/{0}/{1}'.format(
							version, service),
						params: angular.extend(params,{"cache_buster":true,"lang":"en"}),
						withCredentials: false,
						cache: true,
						timeout: (canceller) ? canceller.promise : undefined,
						ignoreLoadingBar: loading
						});
				}
			}
		])
//Gets a Wikipedia entry
	.factory(
		'GetWiki',
		['$resource','$q',
			function($resource, $q) {
				return function(name) {
					var abort = $q.defer();
					return $resource(
						'https://api.mol.org/wiki',
						{},
						{
							query: {
								method:'GET',
								params:{
									name: name,
								},
								ignoreLoadingBar: true,
								isArray:false,
								timeout: abort,
								transformResponse : function(data, headersGetter) {
									return JSON.parse(data);
								}

							}
						}
					);
				}
			}
		]
	)
//Gets a list of image URLs
	.factory(
		'GetImages',
		['$resource','$q',
			function($resource,$q) {
				return function(name,size) {
					var abort = $q.defer();

						return $resource(
							'https://api.mol.org/imgstore/list',
							{'api_key':'allyourbase'},
							{
								query: {
									method:'GET',
									origin: '*',
									withCredentials:false,
									params:{
										name: name
									},
									ignoreLoadingBar: true,
									isArray: true,
									timeout: abort,
									transformResponse : function(data, headersGetter) {
										try {
											var result = JSON.parse(data);
											return result.images.map(
		            			function(v,i){
												v.url = '{0}=s{1}-c'.format(v.url,size)
		            				return v
		            			});
										} catch (e){
											return undefined;
										}
								}
							}
						}
						);
					}
				}
			]
		);
