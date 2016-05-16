angular.module('GeekCtrl', []).controller('GeekController', function($scope,$timeout, $http, $q) {

	$scope.tagline = 'Tagline to window 3';	
	$scope.dataWidth = 1000;
	$scope.dataHeight = 1000;

	$scope.map = [];
	$scope.doIt = function(requestString){
		console.log(requestString);
		$http({
		  method: 'GET',
		  url: requestString
		}).then(function successCallback(response) {
			var element = angular.element('#image_modal');
			element.modal('show');
		    // this callback will be called asynchronously
		    // when the response is available
		    $scope.dataWidth = response.data.message[0].length;
		    $scope.dataHeight = response.data.message.length;
		    $scope.map = [];
		    console.log("start array")
			for(var i = 0, l = $scope.dataHeight; i < l; i++){
				for(var j = 0, k =  $scope.dataWidth; j < k; j++){
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
			image.src = dataToBase64($scope.map, $scope.dataWidth, $scope.dataHeight);

		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log("API failure - map");
		});
	};

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

	  	$scope.square = new google.maps.Rectangle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			draggable: true,
			bounds: {
			  north: 52.713416,
			  south: 51.323747,
			  east: 1.72521973,
			  west: -0.57678223
			}
		});
		$scope.circle = new google.maps.Circle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			draggable: true,
			center: {lat: 53.223668, lng: -1.102773}, 
			radius: 70000
		});
		$scope.sqPaths = [];
		$scope.sqPaths.push(new google.maps.LatLng(51,1));
		$scope.sqPaths.push(new google.maps.LatLng(51,1.5));
		$scope.sqPaths.push(new google.maps.LatLng(51.5,1.5));
		$scope.sqPaths.push(new google.maps.LatLng(51.5,1));
		$scope.diamond = new google.maps.Polygon({
			    map: map,
			    paths: $scope.sqPaths,
			    strokeColor: '#0000FF',
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: '#0000FF',
			    fillOpacity: 0.35,
			    draggable: false,
			    geodesic: false
			});
		console.log($scope.square.getBounds())
		google.maps.event.addListener(map, 'click', function(e) {
	  	});
	  	google.maps.event.addListener($scope.circle, 'dragend', function(e) {
	  		var circBounds = $scope.circle.getBounds();
	  		$scope.square.setBounds($scope.circle.getBounds());

	  		var sqb = {
	  			n : circBounds.getNorthEast().lat(),
	  			s : circBounds.getSouthWest().lat(),
	  			e : circBounds.getNorthEast().lng(),
	  			w : circBounds.getSouthWest().lng()
	  		}
	  		var requestString = 'http://localhost:8080/api/LatLonSquToMap?n=' + sqb.n + 
	  		'&s=' + sqb.s + 
	  		'&e=' + sqb.e + 
	  		'&w=' + sqb.w ;
	  		//console.log(requestString);
	  		$scope.doIt(requestString);
		 //  	$http({
			//   method: 'GET',
			//   url: requestString
			// }).then(function successCallback(response) {
			    
			// 	// console.log(response.data.res);
			// 	// console.log(response.data.res2);

			// 	// var res2 = response.data.res2;
			// 	// console.log(res2);

			// 	// var newPaths = [];
			// 	// for (i=0;i<4;i++){
			// 	// 	newPaths.push( new google.maps.LatLng(res2[i].lat,res2[i].lon));
			// 	// }
			// 	// $scope.sqPaths = newPaths;
			// 	// $scope.diamond.setPaths(newPaths);
			// 	// console.log("newpaths");

			//   }, function errorCallback(response) {
			//     // called asynchronously if an error occurs
			//     // or server returns response with an error status.
			//     console.log("API failure - LatLonSquToMap");
			// });

	  	});
  	}



  	$timeout($scope.initialize(), 100);

});