angular.module('NerdCtrl', []).controller('NerdController', function($scope, $timeout, $http, $q) {

	$scope.tagline = 'Tagline to window 2';
	$scope.squareSide = 27000;
	$scope.squareBaseCoord = [400000,300000];
	$scope.squareCoords = null;
	$scope.square = null;
	$scope.dataLength = 1000;
	$scope.ds = 800

	$scope.doPlus = function() {
		if ($scope.squareSide < 40000) {
	  		$scope.squareSide = $scope.squareSide + 1000;
	  		redrawSquare();
	  	}
	}

	$scope.doMinus = function() {
  		if ($scope.squareSide > 15000) {
  			$scope.squareSide = $scope.squareSide - 1000;
  			redrawSquare();
  		}
  	}

	$scope.resetSquare = function() {
  		$scope.squareSide = 27000;
  		redrawSquare();
  	}

  	$scope.doPlusPx = function() {
		if ($scope.ds < 1200) {
	  		$scope.ds = $scope.ds + 100;
	  		document.getElementById('output-size-display').innerHTML = $scope.ds + 'px';
	  	}
	}

	$scope.doMinusPx = function() {
  		if ($scope.ds > 200) {
  			$scope.ds = $scope.ds - 100;
  			document.getElementById('output-size-display').innerHTML = $scope.ds + 'px';
  		}
  	}

	$scope.resetSquarePx = function() {
  		$scope.ds = 500;
  		document.getElementById('output-size-display').innerHTML = $scope.ds + 'px';
  	}

  	$scope.doExport = function() {
  // 		var element = angular.element('#image_modal');
		// element.modal('show');

		var loading_modal = angular.element('#loading-modal');
		loading_modal.modal('show');

		var now = new Date().getTime();
    
  		var ENLLPromise = getENLLPromise($scope.square.getPath().getArray());
  		ENLLPromise.then(function(OsPoint) {
  			$scope.squareBaseCoord = [OsPoint.easting, OsPoint.northing];
  			var xll = $scope.squareBaseCoord[0];
			xll = Math.round(xll/100)*100;
			var yll = $scope.squareBaseCoord[1];
			yll = Math.round(yll/100)*100;
			var side = $scope.squareSide;
			side = Math.round(side/100)*100;

			var requestString = 'http://localhost:8080/api/map?xll=' + xll + '&yll=' + yll + '&side=' + side + '&ds=' + $scope.ds;
			return $http({
			  method: 'GET',
			  url: requestString
			});
  		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    var dataLength =  response.data.message.length;
		    $scope.dataLength = dataLength;
		    $scope.map = [];

			for(var i = 0, l = dataLength; i < l; i++){
				for(var j = 0, k =  dataLength; j < k; j++){
					var temp = parseInt(response.data.message[i][j]);
					temp = temp*256/65536;
					temp = parseInt(temp);
					$scope.map.push(temp);
				}
			}

			var image = document.getElementById('i');
			//display image only after it's loaded
			image.onload = function(){this.style.display='block'}.bind(image);
			//and finally set the .src
			image.src = dataToBase64($scope.map, dataLength, dataLength);

			loading_modal = angular.element('#loading-modal');
			loading_modal.modal('hide');
			var element = angular.element('#image_modal');
			element.modal('show');


		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log("API failure - map");
		});

  	}

  	$scope.initialize = function() {
  		var mapCanvas = document.getElementById('map-canvas');
  		if (mapCanvas == null){
  			return -1;
  		}
  		var mapOptions = {
  			center: new google.maps.LatLng(53.223668,-1.102773),
      		zoom: 6,
      		mapTypeId: google.maps.MapTypeId.ROADMAP,
      		disableDefaultUI: true
    	}
  		var map = new google.maps.Map(mapCanvas,mapOptions);
  		//$scope.squareCoords = makeSquareCoords();
  		var promise = makeSquareCoordsPromise();

  		$scope.squareCoords = Array(4);
  		promise.then(function(newSquare) {
  			for (i=0; i<4; i++){
  				$scope.squareCoords[i] = new google.maps.LatLng(newSquare[i.toString()].lat,newSquare[i.toString()].lon);
  			}
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
			google.maps.event.addListener(map, 'click', function(e) {
		  	});
		  	google.maps.event.addListener($scope.square, 'dragend', function(e) {
		  		redrawSquare();
		  	});
  		});
  	}

  	function getENLLPromise(pathArray){
  		promise = latLonToOs(pathArray[0].lat(), pathArray[0].lng());
  		return promise;
  	}

  	function makeSquareCoordsPromise(){
		return $q(function(resolve, reject) {
  			setTimeout(function() {
		  		$http({
				  method: 'GET',
				  url: 'http://localhost:8080/api/osGridToLatLonSquare?'+
				  		'easting='+$scope.squareBaseCoord[0]+
				  		'&northing='+$scope.squareBaseCoord[1]+
				  		'&squareSide='+$scope.squareSide
				}).then(function successCallback(response) {
				    // this callback will be called asynchronously
				    // when the response is available
				    resolve(response.data);
				  }, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				    console.log("API failure - osToLatLon");
				    reject("API failure - osToLatLon");
				});
			}, 100);
		});
  	}

  	function redrawSquare(){
  		var ENLLPromise = getENLLPromise($scope.square.getPath().getArray());
  		ENLLPromise.then(function(OsPoint) {
  			$scope.squareBaseCoord = [OsPoint.easting, OsPoint.northing];
  			return makeSquareCoordsPromise();
  		}).then(function(newSquare) {
  			for (i=0; i<4; i++){
  				$scope.squareCoords[i] = new google.maps.LatLng(newSquare[i.toString()].lat,newSquare[i.toString()].lon);
  			}
  			document.getElementById('square-size-display').innerHTML = $scope.squareSide/1000 + 'km';
  			$scope.square.setPath($scope.squareCoords);
  		});
  	}

  	function dataToBase64(colors, width, height){
	    var canvas = document.createElement('canvas'),
	        ctx = canvas.getContext('2d'),
	        color;
	    //setup canvas
	    canvas.width = width,
	    canvas.height = height;
	    //grab data
	    var data = ctx.getImageData(0, 0, width, height),
	        _data = data.data; //simple speed optimization    
	    //place data
	    for(var i = 0, l = _data.length; i < l; i+=4){
	        color = colors[i/4];
	        _data[i] = color,
	        _data[i+1] = color,
	        _data[i+2] = color,
	        _data[i+3] = 255;
	    }
	    ctx.putImageData(data, 0, 0);
	    //return base64 string
	    return canvas.toDataURL();
	}

  	function osToLatLon(easting, northing){
  		return $q(function(resolve, reject) {
  			setTimeout(function() {
		  		$http({
				  method: 'GET',
				  url: 'http://localhost:8080/api/osGridToLatLon?easting='+easting+'&northing='+northing
				}).then(function successCallback(response) {
				    // this callback will be called asynchronously
				    // when the response is available
				    resolve(response.data);
				  }, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				    console.log("API failure - osToLatLon");
				    reject("API failure - osToLatLon");
				});
			}, 100);
		});
  	}

  	function latLonToOs(lat, lon) {
  		return $q(function(resolve, reject) {
  			setTimeout(function() {
		  		$http({
				  method: 'GET',
				  url: 'http://localhost:8080/api/latLonToOsGrid?lat='+lat+'&lon='+lon
				}).then(function successCallback(response) {
				    // this callback will be called asynchronously
				    // when the response is available
				    resolve(response.data);
				  }, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				    console.log("API failure - latLonToOs");
				    reject("API failure - latLonToOs");
				});
			}, 100);
		});
  	}

  	// allow the dom to load
  	$timeout($scope.initialize(), 100);



});