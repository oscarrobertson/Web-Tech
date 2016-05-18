angular.module('GeekCtrl', []).controller('GeekController', function($scope, $timeout, $http, $q) {

	$scope.tagline = 'Tagline to window 2';
	$scope.squareSide = 27000;
	$scope.squareBaseCoord = [400000,300000];
	$scope.squareCoords = Array(4);
	$scope.square = null;
	$scope.dataLength = 1000;
	$scope.ds = 500

  	$scope.initialize = function() {
  		var mapCanvas = document.getElementById('map-canvas');
  		if (mapCanvas == null){
  			return -1;
  		}
  		var mapOptions = {
  			center: new google.maps.LatLng(30,-100),
      		zoom: 5,
    		mapTypeControl: false
    	}
  		var map = new google.maps.Map(mapCanvas,mapOptions);
  		//$scope.squareCoords = makeSquareCoords();
  		
  		initHeightmapMapType();

  		map.mapTypes.set('Heightmap', HEIGHTMAP_MAPTYPE);
  		map.setMapTypeId('Heightmap');

  		var strictBounds = new google.maps.LatLngBounds(
  			new google.maps.LatLng(-60, -180),
		 	new google.maps.LatLng(85, -40)
            
           
	    );

	    // Listen for the dragend event
	    google.maps.event.addListener(map, 'dragend', function() {
	        if (strictBounds.contains(map.getCenter())) return;
	        map.setCenter(new google.maps.LatLng(30,-100));
	    });

  	}

  	var HEIGHTMAP_MAPTYPE;

	function initHeightmapMapType() {
		var HEIGHTMAP_RANGE_X = 200;
		var HEIGHTMAP_RANGE_Y = 200;

		HEIGHTMAP_MAPTYPE = new google.maps.ImageMapType({
		getTileUrl : function(coord, zoom) {
			// var scale = 1 << zoom;

			var x = coord.x;
	      	// if (x < 0 || x >= scale) return null;

			var y = coord.y;
	      	// if (y < 0 || y >= scale) return null;

	      	//zoom = 0;
	      	console.log('http://localhost:8080/api/mappng?z=' + zoom + '&x=' + x + '&y=' + y);

	      	return 'http://localhost:8080/api/mappng?z=' + zoom + '&x=' + x + '&y=' + y ;
	      	// console.log('http://localhost:8080/api/mappng?z=0&x=22&y=19');

	      	// return 'http://localhost:8080/api/mappng?z=0&x=22&y=19';
	        },
		tileSize: new google.maps.Size(HEIGHTMAP_RANGE_X, HEIGHTMAP_RANGE_Y),
	    isPng: true,
	    minZoom: 3,
	    maxZoom: 7,
	    name: 'Heightmap'
	  });

	}

	

  	// allow the dom to load
  	$timeout($scope.initialize(), 100);

});