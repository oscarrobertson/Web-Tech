angular.module('NerdCtrl', []).controller('NerdController', function($scope, $timeout) {

	$scope.tagline = 'Tagline to window 2';
	$scope.squareSide = 18000;
	$scope.squareBaseCoord = [460000,370000];
	$scope.squareCoords = null;
	$scope.square = null;

	$scope.doPlus = function() {
		if ($scope.squareSide < 30000) {
	  		$scope.squareSide = $scope.squareSide + 1000;
	  	}
	  	redrawSquare();
	}

	$scope.doMinus = function() {
  		if ($scope.squareSide > 10000) {
  			$scope.squareSide = $scope.squareSide - 1000;
  		}
  		redrawSquare();
  	}

	$scope.resetSquare = function() {
  		$scope.squareSide = 18000;
  		redrawSquare();
  	}

  	$scope.initialize = function() {
  		var mapCanvas = document.getElementById('map-canvas');
  		if (mapCanvas == null){
  			return -1;
  		}
  		var mapOptions = {
  			center: new google.maps.LatLng(53.223668,-1.102773),
      		zoom: 6,
      		mapTypeId: google.maps.MapTypeId.ROADMAP
    	}
  		var map = new google.maps.Map(mapCanvas,mapOptions);
  		$scope.squareCoords = makeSquareCoords();
  		$scope.square = new google.maps.Polygon({
		    map: map,
		    paths: $scope.squareCoords,
		    strokeColor: '#FF0000',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#FF0000',
		    fillOpacity: 0.35,
		    draggable: true,
		    geodesic: false
		});
  	}

  	function redrawSquare(){
		$scope.squareBaseCoord = getENLL(square.getPath().j,false);
	  	$scope.squareCoords = makeSquareCoords();
	  	document.getElementById('square-size-display').innerHTML = $scope.squareSide/1000 + 'km';
	  	$scope.square.setPath($scope.squareCoords);
  	}

  	//makes LL square using squareBaseCoord and squareSide globals
  	function makeSquareCoords() {
  		output = [];
  		t1 = OsGridRef.osGridToLatLon(new OsGridRef($scope.squareBaseCoord[0], $scope.squareBaseCoord[1]));
  		output.push(new google.maps.LatLng(t1.lat,t1.lon));
  		t1 = OsGridRef.osGridToLatLon(new OsGridRef($scope.squareBaseCoord[0]+$scope.squareSide, $scope.squareBaseCoord[1]));
  		output.push(new google.maps.LatLng(t1.lat,t1.lon));
  		t1 = OsGridRef.osGridToLatLon(new OsGridRef($scope.squareBaseCoord[0]+$scope.squareSide, $scope.squareBaseCoord[1]+$scope.squareSide));
  		output.push(new google.maps.LatLng(t1.lat,t1.lon));
  		t1 = OsGridRef.osGridToLatLon(new OsGridRef($scope.squareBaseCoord[0], $scope.squareBaseCoord[1]+$scope.squareSide));
  		output.push(new google.maps.LatLng(t1.lat,t1.lon));
  		return output;
  	}

  	//input array in gmaps form [rf,rf,rf,rf] where rfG = lat, rf.K = lon 
  	// used to be A and F BUT THEY CHANGED IT RANDOMLY WHY, if you get NaN issues this is likely the problem
  	function getENSquare(pathArray){
  		output = []
  		t1 = OsGridRef.latLonToOsGrid(new LatLon(pathArray[0].G, pathArray[0].K));
  		output.push([t1.easting,t1.northing]);
  		t1 = OsGridRef.latLonToOsGrid(new LatLon(pathArray[1].G, pathArray[1].K));
  		output.push([t1.easting,t1.northing]);
  		t1 = OsGridRef.latLonToOsGrid(new LatLon(pathArray[2].G, pathArray[2].K));
  		output.push([t1.easting,t1.northing]);
  		t1 = OsGridRef.latLonToOsGrid(new LatLon(pathArray[3].G, pathArray[3].K));
  		output.push([t1.easting,t1.northing]);
  		return output;
  	}

  	//input array in gmaps form [rf,rf,rf,rf] where rf.A = lat, rf.F = lon
  	//gets lower left corner in EN of square
  	//set round to true if using for the python script
  	function getENLL(pathArray, round){
  		t1 = OsGridRef.latLonToOsGrid(new LatLon(pathArray[0].G, pathArray[0].K));
  		if (round == true){
  			return [Math.round(t1.easting/100)*100, Math.round(t1.northing/100)*100];
  		}
  		else {
  			return [t1.easting,t1.northing];
  		}
  	}

  	$timeout($scope.initialize(), 100);

});