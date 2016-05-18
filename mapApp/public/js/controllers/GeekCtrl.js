angular.module('GeekCtrl', []).controller('GeekController', function($scope, $timeout, $http, $q) {

  	$scope.initialize = function() {
  		var mapCanvas = document.getElementById('map-canvas');
  		if (mapCanvas == null){
  			return -1;
  		}
  		var mapOptions = {
  			center: new google.maps.LatLng(30,-100),
      		zoom: 3,
    		mapTypeControl: false
    	}
  		var map = new google.maps.Map(mapCanvas,mapOptions);
  		
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
			var x = coord.x;

			var y = coord.y;

	      	return 'http://localhost:8080/api/mappng?z=' + zoom + '&x=' + x + '&y=' + y ;
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