angular.module('mol.ui-map', ['uiGmapgoogle-maps'])
.factory(
	'molUiMap',
	[ 'uiGmapGoogleMapApi','$http','$q','$rootScope','$timeout',
		function(uiGmapGoogleMapApi,$http,$q,$rootScope,$timeout) {

				function OverlayMapType(overlay) {
						var self = this;
						overlay = angular.copy(overlay);
					  	this.show=true;
						this.tiles = {};
						this.getTile = getTile;
						uiGmapGoogleMapApi.then(
							function(maps) {
								self.tileSize = new google.maps.Size(256, 256)});
						this.name = overlay.type;
						this.overlay = overlay;
						this.index= overlay.index;//Math.round(Math.random()*1000);
						this.refresh= true;
						this.opacity= overlay.opacity;
						this.maxZoom= 10;
						this.utfGrid={};

						function getTileUrl(c,z,p) {
								 var u = null,
									 x = c.x, y = c.y;
								 if (p && c.y < Math.pow(2,z) && c.y >= 0) {
									 u = p;
									 while(x < 0) {x += Math.pow(2,z);}
									 while(x>= Math.pow(2,z)) {x-=Math.pow(2,z);}
									 u = p.replace('{z}',z).replace('{x}',x).replace('{y}',c.y);
								 }
								 return u;
							 }
						function releaseTile(tile) {
							console.log(tile);
						}
						function getTile (c,z,d) {

								var img = document.createElement('img'),
									div = document.createElement('div'),
									tile_url = getTileUrl(c,z,this.overlay.tile_url),
									grid_url,
									grid = self.utfGrid;//s[type];

									try{
										if('{0}'.format(this.overlay.grid_url) !== 'null') {
											grid_url = getTileUrl(c,z,this.overlay.grid_url);
											if(grid_url) {
												if(!grid) {grid = {}}
												if(!grid[z]) {grid[z]={}};
												if(!grid[z][c.x]) {grid[z][c.x]={}};
												if(!grid[z][c.x][c.y]) {
													
													// JSONP calls based on AngularJS version
													if (angular.version.major == 1 && angular.version.minor < 6) {
														$http({
															url: '{0}?callback=JSON_CALLBACK'.format(grid_url),
															method: 'JSONP',
															ignoreLoadingbar: true
														}).success(
															function (data, status, headers, config) {
																grid[z][c.x][c.y] = data;
															}
															).error(function (err) { });
													} else {
														$http.jsonp(grid_url, { jsonpCallbackParam: 'callback' })
														.success(function (data) {
															grid[z][c.x][c.y] = data;
														});
													}
												}
											}
										}
									} catch (e){}

								img.style.zIndex = this.index;
								img.style.opacity = this.opacity;
								div.style.width=img.width=this.tileSize.width;
								div.style.width=img.height=this.tileSize.height;


								if(tile_url) {
									img.onload = function(e) {
										delete self.tiles[tile_url];
										if (Object.keys(self.tiles).length<1) {

											$rootScope.$emit('cfpLoadingBar:completed');
										}
									}
									img.onerror = function(e) {
										if (self.tiles[tile_url] < 3) {
											self.tiles[tile_url]++;
										 	$timeout(function () {
										 		this.src = tile_url;
											 }, 2000*Math.random());
										} else {

											delete self.tiles[tile_url];
											img.src = (self.overlay.blank_tile || 'static/app/img/blank_tile.png');
											if (this.tiles && Object.keys(this.tiles).length<1) {
												$rootScope.$emit('cfpLoadingBar:completed');
											}
										}
									}

									$rootScope.$emit('cfpLoadingBar:started');
									this.tiles[tile_url] = 0;

									img.src = tile_url;
									return img;

								} else {
									return div;
								}


							}
				}

			  function molUiMap() {
						var self = this;
						this.tiles = {};
						this.map = {};
						this.bounds = {};
						this.center = {latitude:0,longitude:0};
						this.zoom = 0;
						this.control = {};
						this.options = {
										//fullscreenControl: true,
										//fullscreenControlOptions: {position: 3},
										streetViewControl: false,
										panControl: false,
										maxZoom: 10,
										minZoom: 3,
										styles: styles,
										mapTypeControlOptions: {position: 5}
						};
						this.utfGrid = {};
						this.infowindow = {};
						this.overlayMapTypes=  [new OverlayMapType({tile_url:"",index:0}),new OverlayMapType({tile_url:"",index:1})];
						this.events = {
								click : angular.bind(self,self.interactivity),
								mousemove: angular.bind(self,self.interactivity)

						};
						this.clearOverlays = function() {
				        self.utfGrid={};
				        self.overlayMapTypes =  [new OverlayMapType({tile_url:"",index:0}),new OverlayMapType({tile_url:"",index:1})];
						}
						this.removeOverlay = function(index) {
							this.overlayMapTypes[index] = 
								new OverlayMapType({tile_url:"",index:index});
						}
						this.setOverlay = function(overlay,index) {
							this.overlayMapTypes[index]= new OverlayMapType(overlay);
						}
					}
						molUiMap.prototype.interactivity = function(map, eventName, coords) {
								var self = this,
									data = this.getGridData(map, coords);
								if (data) {
									map.setOptions({ draggableCursor: 'pointer' });
								} else {
									map.setOptions({ draggableCursor: 'default' });
								}
								try {
									this.getInfoWindowModel(map, eventName,coords[0].latLng,data).then(
										function(result) {
											if(result) {
											self.infowindow = angular.extend({
													coords: {
														latitude: coords[0].latLng.lat(),
														longitude:  coords[0].latLng.lng()
													}
												},
												result
											);
										}
								 });} catch(e) {}

						 };



						molUiMap.prototype.resize = function () {
								var self = this;
								uiGmapGoogleMapApi.then(
	                function(maps) {
	                  try {
	                    var	map =  self.control.getGMap(),
												center = map.getCenter();
	                    for(var i=0;i<=700;i+=4) {
	                        $timeout(function() {
	                            google.maps.event.trigger(map,'resize');
	                            map.panTo(center);
	                        },i);
	                    }
	                  } catch (e) {
											//console.log(e);
										}
	                });
							}
						 molUiMap.prototype.getInfoWindowModel = function(map,event,coords,data) {return $q.defer().promise},
						 molUiMap.prototype.getGridData = function(map,coords) {
							 		if (!this.overlayMapTypes[0]) {return}
	 								var i, key, grid  = this.overlayMapTypes[0].utfGrid,
	 										value, zoom = map.getZoom(),
	 										numTiles = 1 << zoom,
	 										projection = new MercatorProjection(),
	 										worldCoordinate = projection.fromLatLngToPoint(coords[0].latLng),
	 										pixelCoordinate = new google.maps.Point(
	 										worldCoordinate.x * numTiles,
	 										worldCoordinate.y * numTiles),
	 										tileCoordinate = new google.maps.Point(
	 												Math.floor(pixelCoordinate.x / 256),
	 												Math.floor(pixelCoordinate.y / 256)),
	 										gridCoordinate = new google.maps.Point(
	 												Math.floor((pixelCoordinate.x - tileCoordinate.x*256)/4),
	 												Math.floor((pixelCoordinate.y - tileCoordinate.y*256)/4));

	 								 try {
	 									 i = grid[zoom][tileCoordinate.x][tileCoordinate.y]
	 												 .grid[gridCoordinate.y].charCodeAt(gridCoordinate.x);
	 									 //decode the UTF code per UTF-grid spec
	 									 //https://github.com/mapbox/mbtiles-spec/blob/master/1.1/utfgrid.md
	 									 if(i>=93) {i--};
	 									 if(i>=35) {i--};
	 									 i-=32;
	 									 key = grid[zoom][tileCoordinate.x][tileCoordinate.y].keys[i]

	 									 value = grid
	 											 [zoom][tileCoordinate.x][tileCoordinate.y]
	 												 .data[String(key)];
	 									} catch(e) {

	 									}
	 									return value;
	 						}

						return molUiMap;

		}
	]
)
